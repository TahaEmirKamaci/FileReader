import React, { useEffect, useState, useRef } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Card } from "primereact/card";

export default function AssignEquipmentPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedUser, setSelectedUser] = useState(user?.id || "");
  const [selectedProduct, setSelectedProduct] = useState("");
  const toast = useRef(null);

  useEffect(() => {
    if (user.role === "ADMIN") {
      api.get("/api/users/all").then(res => setUsers(res.data));
    } else {
      setUsers([{ id: user.id, username: user.username }]);
    }

    const productUrl = user.role === "ADMIN"
      ? "/api/inventory/all-products"
      : "/api/inventory/user-products";

    api.get(productUrl).then(res => setProducts(res.data));
  }, [user]);

  const handleAssign = async (e) => {
    e.preventDefault();
    try {
      if (user.role === "ADMIN") {

        await api.post("/api/inventory/assign", null, {
          params: { userId: selectedUser, itemId: selectedProduct }
        });

      } else {
        await api.post("/api/inventory/assign-to-self", null, {
          params: { itemId: selectedProduct }
        });
      }
      toast.current.show({ severity: 'success', summary: 'Başarılı', detail: 'Ürün başarıyla atandı!', life: 3000 });
    } catch (err) {
      toast.current.show({ severity: 'error', summary: 'Hata', detail: err.response?.data?.error || "Atama başarısız", life: 3000 });
    }
  };

  // ADMIN için çıkarma işlemi
  const handleRemove = async () => {
    try {
      await api.post("/api/inventory/remove-from-user", null, {
        params: { userId: selectedUser, itemId: selectedProduct }
      });
      toast.current.show({ severity: 'success', summary: 'Başarılı', detail: 'Ürün başarıyla çıkarıldı!', life: 3000 });
    } catch (err) {
      toast.current.show({ severity: 'error', summary: 'Hata', detail: err.response?.data?.error || "Çıkarma başarısız", life: 3000 });
    }
  };

  return (
    <div className="p-d-flex p-jc-center p-mt-5">
      <Toast ref={toast} />
      <Card title="Kullanıcıya Ürün Atama" style={{ width: '100%', maxWidth: '500px' }}>
        <form onSubmit={handleAssign} className="p-fluid">
          <div className="p-field p-mb-3">
            <label htmlFor="user">Kullanıcı Seç</label>
            <Dropdown
              id="user"
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.value)}
              options={users.map(u => ({ label: u.username, value: u.id }))}
              placeholder="Kullanıcı seçin"
              disabled={user?.role !== "ADMIN"}
              readOnly={user?.role !== "ADMIN"}
              style={user?.role !== "ADMIN" ? { backgroundColor: '#f5f5f5', pointerEvents: 'none' } : {}}
              required
            />
          </div>

          <div className="p-field p-mb-3">
            <label htmlFor="product">Ürün Seç</label>
            <Dropdown
              id="product"
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.value)}
              options={products.map(p => ({ label: p.name, value: p.id }))}
              placeholder="Ürün seçin"
              required
            />
          </div>

          <Button label="Ata" type="submit" icon="pi pi-check" className="p-mt-2" />
          {user?.role === "ADMIN" && (
            <Button label="Çıkar" type="button" icon="pi pi-times" className="p-mt-2 p-button-danger" onClick={handleRemove} style={{ marginLeft: 8 }} />
          )}
        </form>
      </Card>
    </div>
  );
}
