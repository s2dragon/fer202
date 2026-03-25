import React, { useEffect, useMemo, useState } from "react";
import { Container, Button, Form, Badge, Accordion, Table } from "react-bootstrap";
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
  const [filterStatus, setFilterStatus] = useState("pending_or_preparing"); // adjusted default filter
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const tableById = useMemo(() => {
    return tables.reduce((acc, t) => {
      acc[t.id] = t;
      return acc;
    }, {});
  }, [tables]);

  // Group items into their respective orders
  const groupedOrders = useMemo(() => {
    // 1. Map items to order
    const validItems = orderItems.filter(item => STATUS_FLOW.includes(item.status));
    
    // Group them
    const groups = {};
    for (const item of validItems) {
      if (!groups[item.orderId]) {
        groups[item.orderId] = [];
      }
      groups[item.orderId].push(item);
    }

    // 2. Build final order objects with their items
    let result = orders.map(o => {
      const t = tableById[String(o.tableId)];
      const itemsInOrder = groups[o.id] || [];
      return {
        ...o,
        table: t,
        items: itemsInOrder
      };
    }).filter(o => o.items.length > 0); // Only show orders that have valid items

    // 3. Apply Table Filter
    if (filterTableId) {
      result = result.filter(o => String(o.tableId) === String(filterTableId));
    }

    // 4. Apply Order Status Filter (or based on item states)
    if (filterStatus !== "all") {
      if (filterStatus === "pending_or_preparing") {
         result = result.filter(o => o.items.some(it => it.status === "pending" || it.status === "preparing"));
      } else {
         result = result.filter(o => o.items.some(it => it.status === filterStatus));
      }
    }

    // 5. Sort by time (First In First Out)
    result.sort((a, b) => new Date(a.updatedAt || a.createdAt).getTime() - new Date(b.updatedAt || b.createdAt).getTime());

    return result;
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

  const getBadgeColor = (status) => {
    if (status === "preparing") return "info";
    if (status === "served") return "success";
    return "warning";
  };

  return (
    <Container fluid className="py-4" style={{ maxWidth: '1200px' }}>
      <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
        <h2 className="fw-bold mb-0">Kitchen Dashboard (Danh sách đơn hàng)</h2>
        <Button variant="dark" onClick={onBack}>
          Về khách
        </Button>
      </div>

      <div className="d-flex flex-wrap gap-3 align-items-center mb-4 bg-light p-3 rounded-4 shadow-sm">
        <div className="d-flex align-items-center gap-2">
          <strong>Polling:</strong>
          <span className="text-secondary small">
            {loading ? "Đang tải..." : `Đã có ${groupedOrders.length} đơn hàng`}
          </span>
        </div>
        <Button variant="outline-dark" size="sm" className="fw-bold rounded-pill" onClick={loadData} disabled={loading}>
          Làm mới ngay
        </Button>
      </div>

      {error && <div className="alert alert-danger shadow-sm rounded-4">{error}</div>}

      <div className="d-flex flex-wrap gap-3 mb-4">
        <Form.Group className="d-flex align-items-center gap-2">
          <Form.Label className="mb-0 fw-bold">Bàn:</Form.Label>
          <Form.Select 
            value={filterTableId} 
            onChange={(e) => setFilterTableId(e.target.value)} 
            className="shadow-sm border-0 bg-white"
            style={{ minWidth: '150px' }}
          >
            <option value="">Tất cả</option>
            {tables.map((table) => (
              <option key={table.id} value={table.id}>
                {table.tableNumber}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="d-flex align-items-center gap-2">
          <Form.Label className="mb-0 fw-bold">Trạng thái (Tìm trong đơn):</Form.Label>
          <Form.Select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)} 
            className="shadow-sm border-0 bg-white"
            style={{ minWidth: '200px' }}
          >
            <option value="all">Tất cả</option>
            <option value="pending_or_preparing">Đang chờ / Đang làm</option>
            <option value="pending">Pending (Chờ)</option>
            <option value="preparing">Preparing (Đang làm)</option>
            <option value="served">Served (Đã xong)</option>
          </Form.Select>
        </Form.Group>
      </div>

      {groupedOrders.length === 0 && <div className="text-muted fst-italic">Không có đơn hàng phù hợp</div>}

      <Accordion defaultActiveKey={['0']} alwaysOpen className="shadow-sm rounded-4">
        {groupedOrders.map((order, index) => {
           const timeStr = new Date(order.updatedAt || order.createdAt).toLocaleTimeString("vi-VN");
           
           // Count items by status for a quick summary badge
           const pendingCount = order.items.filter(i => i.status === "pending").length;
           const preparingCount = order.items.filter(i => i.status === "preparing").length;
           const servedCount = order.items.filter(i => i.status === "served").length;

           return (
              <Accordion.Item eventKey={String(index)} key={order.id} className="border-0 mb-3 rounded-4 overflow-hidden shadow-sm">
                 <Accordion.Header className="order-accordion-header">
                    <div className="d-flex justify-content-between align-items-center w-100 pe-3">
                       <div className="d-flex align-items-center gap-3">
                          <Badge bg="danger" className="p-2 fs-6 rounded-3">Bàn {order.table?.tableNumber || "?"}</Badge>
                          <div>
                             <strong className="fs-5">Order #{order.id}</strong>
                             <div className="text-muted small mt-1">
                                Thời gian: <span className="fw-bold text-dark">{timeStr}</span> 
                                {order.note && <span className="ms-2 text-danger fst-italic flex-wrap">- Note: {order.note}</span>}
                             </div>
                          </div>
                       </div>
                       <div className="d-flex gap-2">
                          {pendingCount > 0 && <Badge bg="warning" text="dark" className="rounded-pill px-2">Pending: {pendingCount}</Badge>}
                          {preparingCount > 0 && <Badge bg="info" className="rounded-pill px-2">Preparing: {preparingCount}</Badge>}
                          {servedCount > 0 && <Badge bg="success" className="rounded-pill px-2">Served: {servedCount}</Badge>}
                       </div>
                    </div>
                 </Accordion.Header>
                 <Accordion.Body className="bg-light p-3 border-top">
                    <Table responsive hover className="mb-0 bg-white rounded-3 overflow-hidden shadow-sm border border-light">
                       <thead className="table-light">
                          <tr>
                             <th className="py-3 px-4 text-muted small text-uppercase">Tên món</th>
                             <th className="py-3 px-4 text-muted small text-uppercase text-center">SL</th>
                             <th className="py-3 px-4 text-muted small text-uppercase text-center">Trạng thái hiện tại</th>
                             <th className="py-3 px-4 text-muted small text-uppercase text-end">Thao tác bếp</th>
                          </tr>
                       </thead>
                       <tbody>
                          {order.items.map(item => {
                             const canAdvance = item.status !== "served";
                             const next = item.status === "pending" ? "preparing" : item.status === "preparing" ? "served" : "served";

                             return (
                                <tr key={item.id} className="align-middle">
                                   <td className="py-3 px-4 fw-bold text-dark">
                                      {item.name}
                                   </td>
                                   <td className="py-3 px-4 text-center">
                                      <Badge bg="secondary" className="fs-6 px-2">{item.quantity}</Badge>
                                   </td>
                                   <td className="py-3 px-4 text-center">
                                      <Badge bg={getBadgeColor(item.status)} className="text-uppercase rounded-pill py-1 px-3">
                                         {item.status}
                                      </Badge>
                                   </td>
                                   <td className="py-3 px-4 text-end">
                                      <Button 
                                         variant={canAdvance ? (item.status === 'pending' ? 'info' : 'success') : "outline-secondary"} 
                                         size="sm" 
                                         className="fw-bold px-3 rounded-pill shadow-sm"
                                         onClick={() => changeItemStatus(item)} 
                                         disabled={!canAdvance || loading}
                                      >
                                         {canAdvance ? `Chuyển sang ${next}` : "Hoàn thành"}
                                      </Button>
                                   </td>
                                </tr>
                             );
                          })}
                       </tbody>
                    </Table>
                 </Accordion.Body>
              </Accordion.Item>
           );
        })}
      </Accordion>
      
      {/* Required for Accordion Header custom flex styling without affecting native button styles */}
      <style>{`
        .order-accordion-header button { padding: 1rem 1.25rem; }
      `}</style>
    </Container>
  );
}