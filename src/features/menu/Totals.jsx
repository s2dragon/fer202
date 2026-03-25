import React from "react";

export default function Totals({ totals }) {
  return (
    <div className="border-top mt-3 pt-3">
      <TotalRow label="Buffet" value={`${totals.buffetTotal.toLocaleString()}đ`} />
      <TotalRow label="Add-on" value={`${totals.addonTotal.toLocaleString()}đ`} />
      <TotalRow label="Gọi thêm" value={`${totals.subTotal.toLocaleString()}đ`} />
      <div className="d-flex justify-content-between mt-2 pt-2 border-top">
        <div className="text-secondary fw-bold">Tạm tính</div>
        <div className="fw-bold fs-5 text-danger">{totals.grandTotal.toLocaleString()}đ</div>
      </div>
    </div>
  );
}

function TotalRow({ label, value }) {
  return (
    <div className="d-flex justify-content-between mt-2">
      <div className="text-secondary fw-semibold small">{label}</div>
      <div className="fw-bold small">{value}</div>
    </div>
  );
}