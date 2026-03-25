import React, { useState, useEffect } from "react";
import { createBooking, getBookings, getTables } from "../../api/bookingApi";

export default function BookingUser({ restaurantId = 1, onBack }) {
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [guestCount, setGuestCount] = useState(2);
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  
  const [myBookings, setMyBookings] = useState([]);
  const [viewHistoryPhone, setViewHistoryPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!customerName || !phone || !guestCount || !bookingDate || !bookingTime) {
      return alert("Vui lòng điền đầy đủ thông tin!");
    }
    
    if (loading) return;
    setLoading(true);

    try {
      const allTables = await getTables(restaurantId);
      const totalCapacity = allTables.reduce((sum, t) => sum + t.capacity, 0);

      const allBookings = await getBookings(restaurantId);
      const reqDateTime = new Date(`${bookingDate}T${bookingTime}`);
      
      let bookedGuestsAtSameTime = 0;
      
      for (const b of allBookings) {
        if (b.status === "rejected") continue;
        
        const bTime = new Date(b.bookingTime);
        const diffHours = Math.abs(reqDateTime - bTime) / 36e5;
        
        // Assume a booking takes about 2 hours slot
        if (diffHours < 2) {
          bookedGuestsAtSameTime += Number(b.guestCount);
        }
      }

      if (bookedGuestsAtSameTime + Number(guestCount) > totalCapacity) {
         setLoading(false);
         return alert("Rất tiếc, nhà hàng đã hết chỗ vào khung giờ này. Vui lòng chọn giờ khác!");
      }
      
      // Also check if same phone number already has a pending/approved booking around this time (Check trùng)
      const isDuplicate = allBookings.some(b => {
          if (b.phone === phone && b.status !== "rejected") {
             const bTime = new Date(b.bookingTime);
             const diffHours = Math.abs(reqDateTime - bTime) / 36e5;
             return diffHours < 2;
          }
          return false;
      });
      
      if (isDuplicate) {
          setLoading(false);
          return alert("Bạn đã có một đặt bàn trong khung giờ này rồi!");
      }

      const newBooking = {
        restaurantId,
        customerName,
        phone,
        guestCount: Number(guestCount),
        bookingTime: reqDateTime.toISOString(),
        status: "pending"
      };

      await createBooking(newBooking);
      alert("Đặt bàn thành công! Vui lòng chờ nhà hàng xác nhận.");
      
      // clear form
      setCustomerName("");
      setPhone("");
      setGuestCount(2);
      setBookingDate("");
      setBookingTime("");
      
      if (onBack) onBack();
      
    } catch (error) {
       alert("Lỗi khi đặt bàn: " + error.message);
    } finally {
       setLoading(false);
    }
  };

  const loadHistory = async () => {
      if (!viewHistoryPhone) return alert("Vui lòng nhập SĐT!");
      try {
          const allB = await getBookings(restaurantId);
          const history = allB.filter(b => b.phone === viewHistoryPhone);
          setMyBookings(history);
          if (history.length === 0) alert("Không tìm thấy lịch sử đặt bàn cho SĐT này.");
      } catch(e) {
          alert("Lỗi: " + e.message);
      }
  };

  return (
    <div className="container" style={{ maxWidth: 700, marginTop: "20px", marginBottom: "40px" }}>
      {onBack && (
        <button className="btn btn-outline-secondary btn-sm mb-3 shadow-sm rounded-pill px-3" onClick={onBack}>
          &larr; Quay lại
        </button>
      )}

      <h2 className="mb-4 fw-bold">Đặt Bàn Online</h2>
      <div className="card shadow-sm border-0 rounded-4 mb-5">
        <div className="card-body p-4 bg-light rounded-4">
          <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
            <div>
              <label className="fw-bold mb-1 small text-muted">Tên khách hàng</label>
              <input
                className="form-control py-2 rounded-3"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="VD: Nguyễn Văn A"
              />
            </div>
            <div>
              <label className="fw-bold mb-1 small text-muted">Số điện thoại</label>
              <input
                className="form-control py-2 rounded-3"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="SĐT"
                type="tel"
              />
            </div>
            <div>
              <label className="fw-bold mb-1 small text-muted">Số người</label>
              <input
                className="form-control py-2 rounded-3"
                value={guestCount}
                onChange={(e) =>
                  setGuestCount(e.target.value ? Number(e.target.value.replace(/[^0-9]/g, "")) : "")
                }
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
              />
            </div>
            <div className="row g-3">
              <div className="col-6">
                <label className="fw-bold mb-1 small text-muted">Ngày</label>
                <input
                  className="form-control py-2 rounded-3"
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  type="date"
                />
              </div>
              <div className="col-6">
                <label className="fw-bold mb-1 small text-muted">Giờ</label>
                <input
                  className="form-control py-2 rounded-3"
                  value={bookingTime}
                  onChange={(e) => setBookingTime(e.target.value)}
                  type="time"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`btn btn-danger fw-bold py-2 mt-2 rounded-3 text-white ${loading ? "opacity-50" : ""}`}
            >
              {loading ? "Đang xử lý..." : "Xác nhận đặt bàn"}
            </button>
          </form>
        </div>
      </div>

      <hr className="my-4 text-muted" />

      <h4 className="fw-bold mb-3">Tra cứu lịch sử đặt bàn</h4>
      <div className="d-flex gap-2 mb-4">
        <input
          className="form-control py-2 rounded-3 shadow-none"
          value={viewHistoryPhone}
          onChange={(e) => setViewHistoryPhone(e.target.value)}
          placeholder="Nhập SĐT để tra cứu..."
        />
        <button onClick={loadHistory} className="btn btn-dark fw-bold px-4 rounded-3 text-nowrap">
          Tra cứu
        </button>
      </div>

      <div className="d-flex flex-column gap-3">
        {myBookings.map((b) => {
          let badgeColor = "bg-warning text-dark"; // pending
          let statusText = "Chờ duyệt";
          if (b.status === "approved") {
            badgeColor = "bg-success";
            statusText = "Đã duyệt";
          } else if (b.status === "rejected") {
            badgeColor = "bg-danger";
            statusText = "Từ chối";
          }

          return (
            <div
              key={b.id}
              className="card shadow-sm border-0 rounded-4"
            >
              <div className="card-body d-flex justify-content-between align-items-center p-3">
                <div>
                  <div className="fw-bold text-dark mb-1">
                    {new Date(b.bookingTime).toLocaleString("vi-VN")}
                  </div>
                  <div className="text-secondary small">
                    Khách: {b.customerName} - {b.guestCount} người
                  </div>
                </div>
                <div>
                  <span className={`badge ${badgeColor} rounded-pill px-3 py-2 shadow-sm`}>
                    {statusText}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
