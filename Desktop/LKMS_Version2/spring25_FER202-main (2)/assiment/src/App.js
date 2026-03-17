import React, { useEffect, useMemo, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import ScanQr from "./components/ScanQr";
import BuffetSetup from "./components/BuffetSetup";
import MenuPage from "./components/MenuPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import StaffDashboard from "./pages/StaffDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  getTableByQr,
  getBuffets,
  getBuffetAddons,
  getMenuItems,
  getMenuCategories,
  getActiveOrderByTable,
  createOrder,
  patchOrder,
  getOrderItems,
  addOrderItem,
  patchOrderItem,
  deleteOrderItem,
  calcTotals,
} from "./api/qrOrderApi";

// Component con xử lý luồng đặt món cũ
function OrderFlow() {
  const navigate = useNavigate();
  const [step, setStep] = useState("scan"); // scan | buffet | menu
  const [qrCode, setQrCode] = useState("R1_T1");

  const [table, setTable] = useState(null);
  const [buffets, setBuffets] = useState([]);
  const [addons, setAddons] = useState([]);
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);

  const [order, setOrder] = useState(null);
  const [orderItems, setOrderItems] = useState([]);

  const [selectedBuffetId, setSelectedBuffetId] = useState("");
  const [guestCount, setGuestCount] = useState(2);
  const [selectedAddonIds, setSelectedAddonIds] = useState([]);

  const selectedBuffet = useMemo(
    () => buffets.find((b) => b.id === Number(selectedBuffetId)) || null,
    [buffets, selectedBuffetId]
  );

  const selectedAddons = useMemo(
    () => addons.filter((a) => selectedAddonIds.includes(a.id)),
    [addons, selectedAddonIds]
  );

  const totals = useMemo(
    () =>
      calcTotals({
        buffet: selectedBuffet,
        guestCount,
        addons: selectedAddons,
        orderItems,
      }),
    [selectedBuffet, guestCount, selectedAddons, orderItems]
  );

  // Auto read QR from URL: ?qr=R1_T1
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlQr = params.get("qr");
    if (urlQr) {
      setQrCode(urlQr);
      // auto scan
      setTimeout(() => onScan(urlQr), 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onScan = async (overrideQr) => {
    try {
      const code = (overrideQr ?? qrCode).trim();
      const tb = await getTableByQr(code);
      if (!tb) return alert("Không tìm thấy bàn theo qrCode!");

      setTable(tb);

      const [bf, ad, cats, mi] = await Promise.all([
        getBuffets(tb.restaurantId),
        getBuffetAddons(tb.restaurantId),
        getMenuCategories(),
        getMenuItems(tb.restaurantId),
      ]);

      setBuffets(bf);
      setAddons(ad);
      setCategories(cats);
      setMenuItems(mi);

      const existing = await getActiveOrderByTable(tb.id);
      if (existing) {
        setOrder(existing);
        setSelectedBuffetId(existing.buffetId ? String(existing.buffetId) : "");
        setGuestCount(existing.guestCount || 2);
        setSelectedAddonIds(existing.addonIds || []);
        setOrderItems(await getOrderItems(existing.id));
      } else {
        setOrder(null);
        setOrderItems([]);
        setSelectedBuffetId("");
        setGuestCount(2);
        setSelectedAddonIds([]);
      }

      setStep("buffet");
    } catch (e) {
      alert(e.message);
    }
  };

  const onConfirmBuffet = async () => {
    if (!table) return;
    if (!selectedBuffetId) return alert("Chọn buffet trước!");
    if (guestCount <= 0) return alert("Số khách phải > 0");

    const now = new Date().toISOString();
    const payload = {
      restaurantId: table.restaurantId,
      tableId: table.id,
      orderType: "buffet",
      buffetId: Number(selectedBuffetId),
      guestCount: Number(guestCount),
      addonIds: selectedAddonIds,
      status: "ordering",
      updatedAt: now,
    };

    try {
      let od = order;
      if (!od) {
        od = await createOrder({
          ...payload,
          note: "",
          subTotal: 0,
          buffetTotal: 0,
          addonTotal: 0,
          grandTotal: 0,
          createdAt: now,
        });
        setOrder(od);
      } else {
        od = await patchOrder(od.id, payload);
        setOrder(od);
      }
      setStep("menu");
    } catch (e) {
      alert(e.message);
    }
  };

  const onAddMenuItem = async (mi) => {
    if (!order) return alert("Chưa có order, hãy chọn buffet trước!");

    try {
      const existing = orderItems.find((it) => it.menuItemId === mi.id);
      if (existing) {
        const newQty = existing.quantity + 1;
        const patched = await patchOrderItem(existing.id, {
          quantity: newQty,
          lineTotal: newQty * existing.unitPrice,
        });
        setOrderItems((prev) => prev.map((x) => (x.id === existing.id ? patched : x)));
        return;
      }

      const itemType = mi.price === 0 ? "buffet" : (mi.categoryId === 4 ? "drink" : "alacarte");

      const created = await addOrderItem({
        orderId: order.id,
        menuItemId: mi.id,
        name: mi.name,
        quantity: 1,
        unitPrice: mi.price,
        lineTotal: mi.price,
        itemType,
        status: "pending",
        note: "",
        createdAt: new Date().toISOString(),
      });

      setOrderItems((prev) => [...prev, created]);
    } catch (e) {
      alert(e.message);
    }
  };

  const onQty = async (itemId, delta) => {
    const it = orderItems.find((x) => x.id === itemId);
    if (!it) return;

    try {
      const newQty = it.quantity + delta;
      if (newQty <= 0) {
        await deleteOrderItem(itemId);
        setOrderItems((prev) => prev.filter((x) => x.id !== itemId));
        return;
      }

      const patched = await patchOrderItem(itemId, {
        quantity: newQty,
        lineTotal: newQty * it.unitPrice,
      });
      setOrderItems((prev) => prev.map((x) => (x.id === itemId ? patched : x)));
    } catch (e) {
      alert(e.message);
    }
  };

  const onSubmitToKitchen = async () => {
    if (!order) return;
    try {
      const now = new Date().toISOString();
      const updated = await patchOrder(order.id, {
        buffetTotal: totals.buffetTotal,
        addonTotal: totals.addonTotal,
        subTotal: totals.subTotal,
        grandTotal: totals.grandTotal,
        status: "pending",
        updatedAt: now,
      });
      setOrder(updated);
      alert("Đã gửi bếp / thu ngân!");
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <div style={page}>
      <div style={topBar}>
        <div>
          <div style={{ fontWeight: 800, fontSize: 18 }}>🍲 QR Ordering</div>
          <div style={{ color: "#666", fontSize: 12 }}>
            {table ? `Bàn ${table.tableNumber} • ${table.qrCode}` : "Quét QR để bắt đầu"}
          </div>
        </div>
        <div style={{display: "flex", gap: "10px"}}>
          {step !== "scan" && (
            <button style={btnGhost} onClick={() => setStep("scan")}>
              Đổi bàn
            </button>
          )}
          <button
            style={{
              padding: '8px 16px',
              borderRadius: 10,
              border: 'none',
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              color: 'white',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: 13,
              transition: 'all 0.3s',
              boxShadow: '0 3px 10px rgba(102,126,234,0.3)',
            }}
            onClick={() => navigate('/login')}
          >
            🔑 Đăng nhập
          </button>
        </div>
      </div>

      {step === "scan" && <ScanQr qrCode={qrCode} setQrCode={setQrCode} onScan={() => onScan()} />}

      {step === "buffet" && table && (
        <BuffetSetup
          table={table}
          buffets={buffets}
          addons={addons}
          selectedBuffetId={selectedBuffetId}
          setSelectedBuffetId={setSelectedBuffetId}
          guestCount={guestCount}
          setGuestCount={setGuestCount}
          selectedAddonIds={selectedAddonIds}
          setSelectedAddonIds={setSelectedAddonIds}
          onBack={() => setStep("scan")}
          onConfirm={onConfirmBuffet}
        />
      )}

      {step === "menu" && table && (
        <MenuPage
          table={table}
          categories={categories}
          menuItems={menuItems}
          order={order}
          orderItems={orderItems}
          guestCount={guestCount}
          selectedBuffet={selectedBuffet}
          selectedAddons={selectedAddons}
          totals={totals}
          onAdd={onAddMenuItem}
          onQty={onQty}
          onSubmit={onSubmitToKitchen}
          onChangeBuffet={() => setStep("buffet")}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <ToastContainer position="top-right" autoClose={3000} />
        <Routes>
          <Route path="/" element={<OrderFlow />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/staff"
            element={
              <ProtectedRoute allowedRoles={["staff", "admin"]}>
                <StaffDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

const page = { maxWidth: 980, margin: "0 auto", padding: 16, fontFamily: "system-ui" };

const topBar = {
  position: "sticky",
  top: 0,
  zIndex: 20,
  background: "white",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "10px 0",
  borderBottom: "1px solid #eee",
  marginBottom: 12,
};

const btnGhost = {
  padding: "8px 10px",
  borderRadius: 10,
  border: "1px solid #ddd",
  background: "#f7f7f7",
  cursor: "pointer",
};