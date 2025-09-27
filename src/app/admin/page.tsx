"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function AdminPage() {
  const [restaurant, setRestaurant] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [restaurantData, productsData, categoriesData] = await Promise.all([
        supabase.from("restaurants").select("*").single(),
        supabase
          .from("products")
          .select("*, categories(name)")
          .eq("is_active", true),
        supabase.from("categories").select("*").eq("is_active", true),
      ]);

      setRestaurant(restaurantData.data);
      setProducts(productsData.data || []);
      setCategories(categoriesData.data || []);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateRestaurant = async (updates) => {
    try {
      const { error } = await supabase
        .from("restaurants")
        .update(updates)
        .eq("id", restaurant.id);

      if (!error) {
        setRestaurant({ ...restaurant, ...updates });
        alert("Restaurante atualizado com sucesso!");
      }
    } catch (error) {
      console.error("Erro ao atualizar:", error);
      alert("Erro ao atualizar restaurante");
    }
  };

  if (loading) return <div>Carregando...</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Painel Administrativo</h1>

      {/* Configurações do Restaurante */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Configurações do Restaurante</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="name">Nome do Restaurante</Label>
            <Input
              id="name"
              value={restaurant?.name || ""}
              onChange={(e) =>
                setRestaurant({ ...restaurant, name: e.target.value })
              }
            />
          </div>
          <div>
            <Label htmlFor="address">Endereço</Label>
            <Input
              id="address"
              value={restaurant?.address || ""}
              onChange={(e) =>
                setRestaurant({ ...restaurant, address: e.target.value })
              }
            />
          </div>
          <div>
            <Label htmlFor="logo">Logo (Emoji)</Label>
            <Input
              id="logo"
              value={restaurant?.logo || ""}
              onChange={(e) =>
                setRestaurant({ ...restaurant, logo: e.target.value })
              }
              maxLength={2}
            />
          </div>
          <Button
            onClick={() =>
              updateRestaurant({
                name: restaurant.name,
                address: restaurant.address,
                logo: restaurant.logo,
              })
            }
          >
            Salvar Alterações
          </Button>
        </CardContent>
      </Card>

      {/* Lista de Produtos */}
      <Card>
        <CardHeader>
          <CardTitle>Produtos ({products.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product) => (
              <Card key={product.id}>
                <CardContent className="p-4">
                  <div className="text-center">
                    <div className="text-4xl mb-2">{product.image}</div>
                    <h3 className="font-bold">{product.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {product.description}
                    </p>
                    <p className="text-lg font-bold text-green-600">
                      R\$ {product.price.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-500">
                      Categoria: {product.categories?.name}
                    </p>
                    {product.is_bestseller && (
                      <span className="inline-block bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded mt-2">
                        Mais Vendido
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
