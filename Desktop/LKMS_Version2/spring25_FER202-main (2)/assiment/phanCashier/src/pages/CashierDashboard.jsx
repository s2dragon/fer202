import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import PaymentModal from '../features/cashier/PaymentModal';
import {
  getBuffetAddons,
  getBuffets,
  getOrderItems,
  getOrders,
  getTables,
} from '../api/ApiService';

const styles = {
  page: {
    minHeight: '100vh',
    padding: '20px',
    backgroundColor: '#f5f5f5',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  title: {
    margin: 0,
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#11998e',
  },
  primaryButton: {
    padding: '10px 20px',
    backgroundColor: '#38ef7d',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
  },
  section: {
    marginBottom: '20px',
    padding: '15px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px',
  },
  sectionTitle: {
    margin: 0,
    color: '#11998e',
  },
  secondaryButton: {
    padding: '6px 12px',
    backgroundColor: '#319795',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  tableGrid: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
    gap: '12px',
  },
  stats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '15px',
    marginBottom: '20px',
  },
  statCard: {
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    textAlign: 'center',
  },
  statValue: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#11998e',
  },
  statLabel: {
    marginTop: '8px',
    fontSize: '14px',
    color: '#666',
  },
  orderTable: {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: '#fff',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  headCell: {
    padding: '15px',
    backgroundColor: '#11998e',
    color: '#fff',
    textAlign: 'left',
    fontWeight: 'bold',
    fontSize: '14px',
  },
  bodyCell: {
    padding: '15px',
    borderBottom: '1px solid #e0e0e0',
    fontSize: '14px',
  },
  amount: {
    color: '#11998e',
    fontWeight: 'bold',
    fontSize: '16px',
  },
  empty: {
    padding: '40px',
    textAlign: 'center',
    backgroundColor: '#fff',
    borderRadius: '8px',
    color: '#666',
    fontSize: '16px',
  },
};

const ACTIVE_ORDER_STATUSES = ['ordering', 'pending'];

const formatPrice = (price) =>
  new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(price || 0);

const formatTime = (date) => {
  if (!date) {
    return 'N/A';
  }

  return new Date(date).toLocaleTimeString('vi-VN');
};

const calculateServiceTime = (createdAt) => {
  if (!createdAt) {
    return '0 phút';
  }

  const minutes = Math.floor((Date.now() - new Date(createdAt).getTime()) / 60000);
  return `${minutes} phút`;
};

const CashierDashboard = () => {
  const [tables, setTables] = useState([]);
  const [orders, setOrders] = useState([]);
  const [buffets, setBuffets] = useState([]);
  const [buffetAddons, setBuffetAddons] = useState([]);
  const [selectedTableId, setSelectedTableId] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderItemsByOrder, setOrderItemsByOrder] = useState({});
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchOrderItemsForOrders = useCallback(async (ordersData) => {
    if (!ordersData.length) {
      setOrderItemsByOrder({});
      return;
    }

    try {
      const itemsPerOrder = await Promise.all(
        ordersData.map((order) => getOrderItems(order.id))
      );

      setOrderItemsByOrder(
        ordersData.reduce((accumulator, order, index) => {
          accumulator[order.id] = itemsPerOrder[index] || [];
          return accumulator;
        }, {})
      );
    } catch (error) {
      console.error('Error fetching order items:', error);
      setOrderItemsByOrder({});
    }
  }, []);

  const fetchPendingOrders = useCallback(
    async (tableId = selectedTableId) => {
      try {
        setLoading(true);
        const [orderingOrders, pendingOrders] = await Promise.all([
          getOrders('ordering', tableId),
          getOrders('pending', tableId),
        ]);

        const mergedOrders = [...orderingOrders, ...pendingOrders];
        setOrders(mergedOrders);
        await fetchOrderItemsForOrders(mergedOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
        toast.error('Không thể tải danh sách đơn hàng');
      } finally {
        setLoading(false);
      }
    },
    [fetchOrderItemsForOrders, selectedTableId]
  );

  const fetchInitialData = useCallback(async () => {
    try {
      const [tablesData, buffetsData, addonsData] = await Promise.all([
        getTables(),
        getBuffets(),
        getBuffetAddons(),
      ]);

      setTables(tablesData);
      setBuffets(buffetsData);
      setBuffetAddons(addonsData);
    } catch (error) {
      console.error('Error fetching initial data:', error);
      toast.error('Không thể tải dữ liệu thu ngân');
    }
  }, []);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  useEffect(() => {
    fetchPendingOrders(selectedTableId);
  }, [fetchPendingOrders, selectedTableId]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchPendingOrders(selectedTableId);
    }, 5000);

    return () => clearInterval(intervalId);
  }, [fetchPendingOrders, selectedTableId]);

  const handlePaymentSuccess = async (updatedOrder) => {
    setOrders((prevOrders) => prevOrders.filter((order) => order.id !== updatedOrder.id));
    setOrderItemsByOrder((prevItems) => {
      const nextItems = { ...prevItems };
      delete nextItems[updatedOrder.id];
      return nextItems;
    });
    setShowPaymentModal(false);
    setSelectedOrder(null);
  };

  const getBuffetName = (buffetId) =>
    buffets.find((buffet) => String(buffet.id) === String(buffetId))?.name || 'N/A';

  const getAddonNames = (addonIds = []) => {
    if (!addonIds.length) {
      return 'Không';
    }

    return addonIds
      .map(
        (id) =>
          buffetAddons.find((addon) => String(addon.id) === String(id))?.name ||
          `Addon ${id}`
      )
      .join(', ');
  };

  const visibleTables = useMemo(() => {
    if (!selectedTableId) {
      return tables;
    }

    return tables.filter((table) => String(table.id) === String(selectedTableId));
  }, [tables, selectedTableId]);

  const getTableById = useCallback(
    (tableId) => tables.find((table) => String(table.id) === String(tableId)),
    [tables]
  );

  const calculateOrderTotal = useCallback(
    (order) => {
      if (!order) {
        return 0;
      }

      const buffetTotal = Number(order.buffetTotal) || 0;
      const addonTotal = Number(order.addonTotal) || 0;
      const itemsTotal = (orderItemsByOrder[order.id] || []).reduce(
        (sum, item) => sum + (Number(item.lineTotal) || 0),
        0
      );

      return buffetTotal + addonTotal + itemsTotal || Number(order.grandTotal) || 0;
    },
    [orderItemsByOrder]
  );

  const latestActiveOrders = useMemo(() => {
    const ordersByTable = new Map();

    orders
      .filter((order) => ACTIVE_ORDER_STATUSES.includes(order.status))
      .forEach((order) => {
        const tableKey = String(order.tableId);
        const existingOrder = ordersByTable.get(tableKey);
        const orderTime = new Date(order.updatedAt || order.createdAt || 0).getTime();
        const existingTime = existingOrder
          ? new Date(existingOrder.updatedAt || existingOrder.createdAt || 0).getTime()
          : 0;

        if (!existingOrder || orderTime > existingTime) {
          ordersByTable.set(tableKey, order);
        }
      });

    return Array.from(ordersByTable.values()).sort(
      (first, second) => Number(first.tableId) - Number(second.tableId)
    );
  }, [orders]);

  const pendingRevenue = useMemo(
    () => latestActiveOrders.reduce((sum, order) => sum + calculateOrderTotal(order), 0),
    [calculateOrderTotal, latestActiveOrders]
  );

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.title}>Thu Ngân 💳</h1>
        <button style={styles.primaryButton} onClick={() => fetchPendingOrders()}>
          🔄 Làm mới
        </button>
      </div>

      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Danh sách bàn</h2>
          <button
            style={styles.secondaryButton}
            onClick={() => setSelectedTableId(null)}
          >
            Xem tất cả
          </button>
        </div>

        <ul style={styles.tableGrid}>
          {visibleTables.map((table) => {
            const hasOrder = latestActiveOrders.some(
              (order) => String(order.tableId) === String(table.id)
            );
            const isActive = String(selectedTableId) === String(table.id);

            return (
              <li
                key={table.id}
                onClick={() => setSelectedTableId(table.id)}
                style={{
                  backgroundColor: '#fff',
                  borderRadius: '16px',
                  padding: '12px',
                  border: isActive ? '2px solid #0ea5e9' : '1px solid #22c55e',
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(34, 197, 94, 0.18)',
                }}
              >
                <strong style={{ fontSize: '16px' }}>Bàn {table.tableNumber}</strong>
                <br />
                <small
                  style={{
                    color: hasOrder ? '#dc2626' : '#16a34a',
                    fontWeight: 600,
                  }}
                >
                  {hasOrder ? 'Có đơn' : 'Rảnh'}
                </small>
              </li>
            );
          })}
        </ul>
      </div>

      <div style={styles.stats}>
        <div style={styles.statCard}>
          <div style={styles.statValue}>{latestActiveOrders.length}</div>
          <div style={styles.statLabel}>Đơn chờ thanh toán</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statValue}>{formatPrice(pendingRevenue)}</div>
          <div style={styles.statLabel}>Tổng doanh thu chờ</div>
        </div>
      </div>

      {loading && <div style={styles.empty}>Đang tải...</div>}

      {!loading && latestActiveOrders.length === 0 ? (
        <div style={styles.empty}>✅ Không có đơn hàng chờ thanh toán</div>
      ) : (
        !loading && (
          <table style={styles.orderTable}>
            <thead>
              <tr>
                <th style={styles.headCell}>Bàn</th>
                <th style={styles.headCell}>Khách</th>
                <th style={styles.headCell}>Loại buffet</th>
                <th style={styles.headCell}>Addon</th>
                <th style={styles.headCell}>Thời gian phục vụ</th>
                <th style={styles.headCell}>Tổng cộng</th>
                <th style={styles.headCell}>Giờ tạo</th>
                <th style={styles.headCell}></th>
              </tr>
            </thead>
            <tbody>
              {latestActiveOrders.map((order) => {
                const table = getTableById(order.tableId);
                const displayedGuestCount =
                  Number(table?.capacity) || Number(order.guestCount) || 1;

                return (
                  <tr key={order.id} style={{ backgroundColor: '#f9f9f9' }}>
                    <td style={styles.bodyCell}>
                      <strong>Bàn {table?.tableNumber || order.tableId || 'N/A'}</strong>
                    </td>
                    <td style={styles.bodyCell}>{displayedGuestCount} người</td>
                    <td style={styles.bodyCell}>
                      {order.orderType === 'buffet'
                        ? getBuffetName(order.buffetId)
                        : 'À la carte'}
                    </td>
                    <td style={styles.bodyCell}>
                      {order.orderType === 'buffet'
                        ? getAddonNames(order.addonIds)
                        : 'N/A'}
                    </td>
                    <td style={styles.bodyCell}>{calculateServiceTime(order.createdAt)}</td>
                    <td style={{ ...styles.bodyCell, ...styles.amount }}>
                      {formatPrice(calculateOrderTotal(order))}
                    </td>
                    <td style={styles.bodyCell}>{formatTime(order.createdAt)}</td>
                    <td style={styles.bodyCell}>
                      <button
                        style={styles.primaryButton}
                        onClick={() => {
                          setSelectedOrder(order);
                          setShowPaymentModal(true);
                        }}
                      >
                        💰 Thanh toán
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )
      )}

      {showPaymentModal && selectedOrder && (
        <PaymentModal
          order={selectedOrder}
          orderItems={orderItemsByOrder[selectedOrder.id] || []}
          onClose={() => setShowPaymentModal(false)}
          onSuccess={handlePaymentSuccess}
          buffets={buffets}
          buffetAddons={buffetAddons}
        />
      )}
    </div>
  );
};

export default CashierDashboard;
