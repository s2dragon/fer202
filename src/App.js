import React, { useEffect, useMemo, useRef, useState } from "react";
import { Navbar, Container, Nav, Button } from "react-bootstrap";
import ScanQr from "./features/scan/ScanQr";
import BuffetSetup from "./features/buffet/BuffetSetup";
import MenuPage from "./features/menu/MenuPage";
import KitchenDashboard from "./features/kitchen/KitchenDashboard";
import BookingUser from "./features/booking/BookingUser";
import BookingStaff from "./features/booking/BookingStaff";
import Login from "./features/auth/Login";
import CashierDashboard from "./features/cashier/CashierDashboard";
import AdminIndex from "./features/admin/index";
import OrderHistory from "./features/admin/OrderHistory";

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

export default function App() {
  const [user, setUser] = useState(null);
  const [step, setStep] = useState("scan"); // scan | buffet | menu | login ...
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
  const [orderNote, setOrderNote] = useState("");

  const apiCacheRef = useRef({
    buffets: {},
    addons: {},
    menuItems: {},
    categories: null,
  });

  const selectedBuffet = useMemo(
    () => buffets.find((b) => String(b.id) === String(selectedBuffetId)) || null,
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

      const restaurantId = tb.restaurantId;

      const [bf, ad, cats, mi] = await Promise.all([
        apiCacheRef.current.buffets[restaurantId]
          ? Promise.resolve(apiCacheRef.current.buffets[restaurantId])
          : getBuffets(restaurantId).then((res) => {
              apiCacheRef.current.buffets[restaurantId] = res;
              return res;
            }),
        apiCacheRef.current.addons[restaurantId]
          ? Promise.resolve(apiCacheRef.current.addons[restaurantId])
          : getBuffetAddons(restaurantId).then((res) => {
              apiCacheRef.current.addons[restaurantId] = res;
              return res;
            }),
        apiCacheRef.current.categories
          ? Promise.resolve(apiCacheRef.current.categories)
          : getMenuCategories().then((res) => {
              apiCacheRef.current.categories = res;
              return res;
            }),
        apiCacheRef.current.menuItems[restaurantId]
          ? Promise.resolve(apiCacheRef.current.menuItems[restaurantId])
          : getMenuItems(restaurantId).then((res) => {
              apiCacheRef.current.menuItems[restaurantId] = res;
              return res;
            }),
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
        setOrderNote(existing.note || "");
        setOrderItems(await getOrderItems(existing.id));
      } else {
        setOrder(null);
        setOrderItems([]);
        setSelectedBuffetId("");
        setGuestCount(2);
        setSelectedAddonIds([]);
        setOrderNote("");
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
      note: orderNote,
      updatedAt: now,
    };

    try {
      let od = order;
      if (!od) {
        od = await createOrder({
          ...payload,
          note: orderNote,
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

  // Add to cart with animation handled in MenuCard; here only data logic
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

      // type for UI label
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
        note: orderNote,
        updatedAt: now,
      });
      setOrder(updated);
      alert("Đã gửi bếp / thu ngân!");
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <div style={{ fontFamily: "system-ui", background: "#f8f9fa", minHeight: "100vh" }}>
      <Navbar bg="white" expand="lg" className="shadow-sm mb-4 sticky-top">
        <Container>
          <Navbar.Brand>
            <div style={{ fontWeight: 800, fontSize: 18 }}>QR Ordering</div>
            <div style={{ color: "#666", fontSize: 12 }}>
              {table ? `Bàn ${table.tableNumber} • ${table.qrCode}` : "Quét QR để bắt đầu"}
            </div>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto align-items-center" style={{ gap: "8px" }}>
              {user ? (
                <span style={{ fontSize: 14, marginRight: "10px" }}>
                  Chào, <b className="text-danger">{user.username}</b> ({user.role}) |{" "}
                  <span style={{ cursor: "pointer", color: "blue", textDecoration: "underline" }} onClick={() => setUser(null)}>Thoát</span>
                </span>
              ) : (
                <Button variant="outline-primary" size="sm" onClick={() => setStep("login")}>Đăng nhập</Button>
              )}

              <Button variant="outline-dark" size="sm" onClick={() => setStep("booking-user")}>
                Đặt bàn
              </Button>

              {user && (user.role === "admin" || user.role === "restaurant") && (
                <>
                  <Button variant="outline-dark" size="sm" onClick={() => setStep("booking-staff")}>
                    QL Đặt bàn
                  </Button>
                  <Button variant="outline-dark" size="sm" onClick={() => setStep("kitchen")}>
                    Bếp
                  </Button>
                  <Button variant="outline-dark" size="sm" onClick={() => setStep("cashier")}>
                    Thu ngân
                  </Button>
                  <Button variant="outline-dark" size="sm" onClick={() => setStep("history")}>
                    Lịch sử Đơn
                  </Button>
                  {user.role === "admin" && (
                    <Button variant="outline-danger" size="sm" onClick={() => setStep("admin")}>
                      Quản trị (Admin)
                    </Button>
                  )}
                </>
              )}

              {step !== "scan" && step !== "kitchen" && step !== "history" && !step.startsWith("booking") && step !== "login" && (
                <Button variant="dark" size="sm" onClick={() => setStep("scan")}>
                  Đổi bàn
                </Button>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container>

      {step === "login" && <Login onLoginSuccess={(u) => { setUser(u); setStep("scan"); }} onBack={() => setStep("scan")} />}

      {step === "scan" && <ScanQr qrCode={qrCode} setQrCode={setQrCode} onScan={() => onScan()} />}

      {step === "kitchen" && user && (user.role === "admin" || user.role === "restaurant") && <KitchenDashboard onBack={() => setStep("scan")} />}

      {step === "cashier" && user && (user.role === "admin" || user.role === "restaurant") && <CashierDashboard onBack={() => setStep("scan")} />}

      {step === "history" && user && (user.role === "admin" || user.role === "restaurant") && <OrderHistory onBack={() => setStep("scan")} />}

      {step === "admin" && user && user.role === "admin" && <AdminIndex onBack={() => setStep("scan")} />}

      {step === "booking-user" && <BookingUser onBack={() => setStep("scan")} />}

      {step === "booking-staff" && user && (user.role === "admin" || user.role === "restaurant") && <BookingStaff onBack={() => setStep("scan")} />}

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
          selectedBuffet={buffets.find((b) => String(b.id) === String(selectedBuffetId))}
          selectedAddons={addons.filter((a) => selectedAddonIds.includes(a.id))}
          totals={totals}
          onAdd={onAddMenuItem}
          onQty={onQty}
          onSubmit={onSubmitToKitchen}
          onChangeBuffet={() => setStep("buffet")}
          orderNote={orderNote}
          setOrderNote={setOrderNote}
        />
      )}
      </Container>
    </div>
  );
}

// Styles removed in favor of React Bootstrap CSS
