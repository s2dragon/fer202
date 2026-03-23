import React, { useEffect, useMemo, useState } from "react";
import {
  getAllTables,
  getOrders,
  getOrderItemsAll,
  patchOrder,
  patchOrderItem,
} from "../../api/qrOrderApi";

const STATUS_FLOW = ["pending", "preparing", "served"];

export default function KitchenDashboard({ onBack }) {
  const [tables, setTables] = useState([]);
  const [orders, setOrders] = useState([]);
  const [orderItems, setOrderItems] = useState([]);
  const [filterTableId, setFilterTableId] = useState("");
  const [filterStatus, setFilterStatus] = useState("pending");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadData = async () => {
    setLoading(true);
    setError("");

    try {
      const [tablesRes, ordersRes, orderItemsRes] = await Promise.all([
        getAllTables(),
        getOrders(),
        getOrderItemsAll(),
      ]);

      setTables(tablesRes || []);
      setOrders(ordersRes || []);
      setOrderItems(orderItemsRes || []);
    } catch (e) {
      setError(e?.message || "Lỗi khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const timer = setInterval(loadData, 3000);
    return () => clearInterval(timer);
  }, []);

  const tableById = useMemo(() => {
    return tables.reduce((acc, t) => {
      acc[t.id] = t;
      return acc;
    }, {});
  }, [tables]);

  const visibleItems = useMemo(() => {
    const allowed = STATUS_FLOW;
    const byStatus = (item) => (filterStatus === "all" ? true : item.status === filterStatus);

    const mapWithOrder = orderItems
      .map((item) => {
        const order = orders.find((o) => String(o.id) === String(item.orderId));
        if (!order) return null;
        if (filterTableId && String(order.tableId) !== String(filterTableId)) return null;
        return { ...item, order, table: tableById[String(order.tableId)] };
      })
      .filter(Boolean)
      .filter((item) => allowed.includes(item.status) && byStatus(item));

    return mapWithOrder.sort((a, b) => {
      return STATUS_FLOW.indexOf(a.status) - STATUS_FLOW.indexOf(b.status) || (a.orderId > b.orderId ? 1 : -1);
    });
  }, [orderItems, orders, tableById, filterTableId, filterStatus]);

  const changeItemStatus = async (item) => {
    const currentIndex = STATUS_FLOW.indexOf(item.status);
    const nextStatus = STATUS_FLOW[Math.min(currentIndex + 1, STATUS_FLOW.length - 1)];

    try {
      const patchedItem = await patchOrderItem(item.id, {
        status: nextStatus,
        updatedAt: new Date().toISOString(),
      });
      setOrderItems((prev) => prev.map((x) => (String(x.id) === String(item.id) ? patchedItem : x)));

      if (nextStatus === "served") {
        const orderItemsOfOrder = orderItems
          .map((x) => (String(x.id) === String(item.id) ? patchedItem : x))
          .filter((x) => String(x.orderId) === String(item.orderId));

        const allServed = orderItemsOfOrder.every((x) => x.status === "served");
        if (allServed) {
          const patchedOrder = await patchOrder(item.orderId, {
            status: "served",
            updatedAt: new Date().toISOString(),
          });
          setOrders((prev) => prev.map((o) => (String(o.id) === String(patchedOrder.id) ? patchedOrder : o)));
        }
      }
    } catch (e) {
      alert("Cập nhật trạng thái lỗi: " + (e.message || e));
    }
  };

  return (
    <div>
      <div style={headerBar}>
        <h2>Kitchen Dashboard</h2>
        <button style={btn} onClick={onBack}>
          Về khách
        </button>
      </div>

      <div style={infoBar}>
        <span>
          <strong>Polling:</strong>
        </span>
        <span style={{ color: "#999" }}>
          {loading ? "Đang tải..." : `Đã có ${visibleItems.length} mục`}
        </span>
        <button style={btnSmall} onClick={loadData} disabled={loading}>
          Làm mới ngay
        </button>
      </div>

      {error && <div style={errorStyle}>{error}</div>}

      <div style={filterBar}>
        <label>
          Bàn:
          <select value={filterTableId} onChange={(e) => setFilterTableId(e.target.value)} style={selectStyle}>
            <option value="">Tất cả</option>
            {tables.map((table) => (
              <option key={table.id} value={table.id}>
                {table.tableNumber}
              </option>
            ))}
          </select>
        </label>

        <label>
          Trạng thái:
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={selectStyle}>
            <option value="all">Tất cả</option>
            <option value="pending">Pending</option>
            <option value="preparing">Preparing</option>
            <option value="served">Served</option>
          </select>
        </label>
      </div>

      <div style={grid}>
        {visibleItems.length === 0 && <div style={{ color: "#777" }}>Không có món phù hợp</div>}

        {visibleItems.map((item) => {
          const canAdvance = item.status !== "served";
          const next = item.status === "pending" ? "preparing" : item.status === "preparing" ? "served" : "served";

          return (
            <div key={`${item.id}-${item.orderId}`} style={card}>
              <div style={row}>
                <div>
                  <strong>{item.name}</strong> x{item.quantity}
                </div>
                <div style={statusBadge(item.status)}>{item.status}</div>
              </div>

              <div style={textSmall}>Order #{item.orderId} / Bàn {item.table?.tableNumber ?? item.order?.tableId}</div>
              <div style={textSmall}>Order status: {item.order?.status || "-"}</div>
              <div style={textSmall}>Note khách: {item.order?.note || "Không có"}</div>

              <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
                <button style={btnSmall} onClick={() => changeItemStatus(item)} disabled={!canAdvance || loading}>
                  {canAdvance ? `Chuyển sang ${next}` : "Hoàn thành"}
                </button>
                <button style={btnSmall} onClick={loadData} disabled={loading}>
                  Tải lại
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const headerBar = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 12,
};

const infoBar = {
  display: "flex",
  gap: 12,
  alignItems: "center",
  marginBottom: 10,
};

const filterBar = {
  display: "flex",
  gap: 16,
  flexWrap: "wrap",
  marginBottom: 14,
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
  gap: 12,
};

const card = {
  border: "1px solid #ddd",
  borderRadius: 10,
  padding: 12,
  background: "#fff",
};

const row = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 12,
};

const textSmall = {
  color: "#555",
  fontSize: 12,
  marginTop: 4,
};

const statusBadge = (status) => ({
  padding: "3px 8px",
  borderRadius: 999,
  textTransform: "uppercase",
  fontSize: 10,
  fontWeight: 800,
  background: status === "pending" ? "#ffe9ad" : status === "preparing" ? "#cce5ff" : "#d4edda",
  color: status === "served" ? "#155724" : "#333",
  border: "1px solid #ccc",
});

const btn = {
  border: "1px solid #111",
  background: "#111",
  color: "#fff",
  borderRadius: 8,
  padding: "8px 12px",
  cursor: "pointer",
};

const btnSmall = {
  border: "1px solid #111",
  background: "#fff",
  color: "#111",
  borderRadius: 8,
  padding: "6px 10px",
  cursor: "pointer",
  fontSize: 12,
};

const selectStyle = {
  marginLeft: 8,
  padding: "5px 8px",
  borderRadius: 6,
  border: "1px solid #ccc",
};

const errorStyle = {
  background: "#fdecea",
  color: "#a94442",
  border: "1px solid #f5c6cb",
  padding: 8,
  borderRadius: 6,
  marginBottom: 10,
};