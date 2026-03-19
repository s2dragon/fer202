import React, { useEffect, useMemo, useState } from "react";
import SearchBar from "./SearchBar";
import CategoryTabs from "./CategoryTabs";
import MenuGrid from "./MenuGrid";
import FloatingCartBar from "./FloatingCartBar";
import CartDrawer from "./CartDrawer";

export default function MenuPage({
  table,
  categories,
  menuItems,
  order,
  orderItems,
  guestCount,
  selectedBuffet,
  selectedAddons,
  totals,
  onAdd,
  onQty,
  onSubmit,
  onChangeBuffet,
}) {
  const [activeCategoryId, setActiveCategoryId] = useState(null);
  const [search, setSearch] = useState("");
  const [cartOpen, setCartOpen] = useState(false);

  // Removed: auto-set category to show all by default

  const filtered = useMemo(() => {
    const rid = Number(table.restaurantId);

    const byRestaurant = (menuItems || []).filter((m) => Number(m.restaurantId) === rid);

    const q = search.trim().toLowerCase();

    // ✅ Nếu có search thì show hết món, không lọc category
    const byCategory =
      activeCategoryId == null || q
        ? byRestaurant
        : byRestaurant.filter((m) => Number(m.categoryId) === Number(activeCategoryId));

    const bySearch = q ? byCategory.filter((m) => (m.name || "").toLowerCase().includes(q)) : byCategory;

    return bySearch;
  }, [menuItems, table.restaurantId, activeCategoryId, search]);

  // Preload item images once per menu update (helps avoid repeated image decoding on rerenders)
  useEffect(() => {
    const urls = Array.from(new Set((menuItems || []).map((m) => m.image).filter(Boolean)));
    urls.forEach((url) => {
      const img = new Image();
      img.src = url;
    });
  }, [menuItems]);

  return (
    <div>
      {/* ✅ Chỉ render SearchBar 1 lần */}
      <div style={block}>
        <SearchBar value={search} onChange={setSearch} />
        <div style={{ height: 10 }} />

        {/* ✅ categories rỗng thì vẫn không crash */}
        <CategoryTabs
          categories={categories || []}
          activeId={activeCategoryId}
          onChange={(id) => setActiveCategoryId(id === null ? null : Number(id))}
        />
      </div>

      {/* Debug nhỏ: nếu vẫn trắng bạn sẽ thấy lý do */}
      {(categories?.length === 0 || filtered.length === 0) && (
        <div style={{ color: "#888", fontSize: 13, margin: "10px 0" }}>
          Debug: categories={categories?.length || 0}, items={menuItems?.length || 0}, filtered={filtered.length}
        </div>
      )}

      <MenuGrid items={filtered} onAdd={onAdd} />

      <FloatingCartBar orderItems={orderItems} total={totals.grandTotal} onOpen={() => setCartOpen(true)} />

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        orderItems={orderItems}
        onQty={onQty}
        totals={totals}
        selectedBuffet={selectedBuffet}
        guestCount={guestCount}
        selectedAddons={selectedAddons}
        onSubmit={onSubmit}
        onChangeBuffet={() => {
          setCartOpen(false);
          onChangeBuffet();
        }}
        orderStatus={order?.status}
      />
    </div>
  );
}

const block = {
  position: "sticky",
  top: 56,
  zIndex: 10,
  background: "white",
  paddingBottom: 12,
};