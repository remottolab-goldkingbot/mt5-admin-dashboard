import { useState } from "react";

export default function LicensePlans() {
  const [plans, setPlans] = useState([
    { id: 1, name: "Lifetime", duration: null },
    { id: 2, name: "Mensual", duration: 30 },
    { id: 3, name: "Anual", duration: 365 },
  ]);

  const [form, setForm] = useState({
    name: "",
    type: "days",
    days: "",
  });

  const handleCreate = () => {
    if (!form.name) return;

    const newPlan = {
      id: Date.now(),
      name: form.name,
      duration: form.type === "lifetime" ? null : Number(form.days),
    };

    setPlans([newPlan, ...plans]);

    setForm({
      name: "",
      type: "days",
      days: "",
    });
  };

  const handleDelete = (id) => {
    setPlans(plans.filter((p) => p.id !== id));
  };

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-6">Planes de Licencia</h1>

      {/* FORM */}
      <div className="bg-gray-900 p-4 rounded-xl mb-6">
        <h2 className="text-lg mb-4">Crear Plan</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Nombre */}
          <input
            type="text"
            placeholder="Nombre del plan"
            className="p-2 rounded bg-gray-800 border border-gray-700"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />

          {/* Tipo */}
          <select
            className="p-2 rounded bg-gray-800 border border-gray-700"
            value={form.type}
            onChange={(e) =>
              setForm({ ...form, type: e.target.value })
            }
          >
            <option value="days">Días</option>
            <option value="lifetime">Lifetime</option>
          </select>

          {/* Días */}
          {form.type === "days" && (
            <input
              type="number"
              placeholder="Cantidad de días"
              className="p-2 rounded bg-gray-800 border border-gray-700"
              value={form.days}
              onChange={(e) =>
                setForm({ ...form, days: e.target.value })
              }
            />
          )}
        </div>

        <button
          onClick={handleCreate}
          className="mt-4 bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
        >
          Crear Plan
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-gray-900 p-4 rounded-xl">
        <h2 className="text-lg mb-4">Lista de Planes</h2>

        <table className="w-full text-left">
          <thead>
            <tr className="text-gray-400 border-b border-gray-700">
              <th className="p-2">Nombre</th>
              <th className="p-2">Duración</th>
              <th className="p-2">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {plans.map((plan) => (
              <tr key={plan.id} className="border-b border-gray-800">
                <td className="p-2">{plan.name}</td>

                <td className="p-2">
                  {plan.duration === null
                    ? "∞ Lifetime"
                    : `${plan.duration} días`}
                </td>

                <td className="p-2 flex gap-2">
                  <button className="bg-yellow-600 px-2 py-1 rounded text-sm">
                    Editar
                  </button>

                  <button
                    onClick={() => handleDelete(plan.id)}
                    className="bg-red-600 px-2 py-1 rounded text-sm"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}

            {plans.length === 0 && (
              <tr>
                <td colSpan="3" className="p-4 text-center text-gray-500">
                  No hay planes creados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}