import React from "react";
import { Form, InputGroup } from "react-bootstrap";

export default function SearchBar({ value, onChange }) {
  return (
    <InputGroup className="mb-3 shadow-sm rounded-4 overflow-hidden">
      <InputGroup.Text className="bg-white border-0 ps-3">🔍</InputGroup.Text>
      <Form.Control
        placeholder="Tìm món… (vd: tokbokki, bò, tôm, coca)"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border-0 py-2 shadow-none"
        style={{ fontSize: 14 }}
      />
    </InputGroup>
  );
}