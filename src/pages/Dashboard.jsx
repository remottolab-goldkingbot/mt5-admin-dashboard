import { useEffect, useState } from "react";
import {
TrashIcon,
PowerIcon,
MagnifyingGlassIcon,
PlusIcon,
UserIcon,
EnvelopeIcon,
PhoneIcon,
ClipboardIcon,
ArrowPathIcon
} from "@heroicons/react/24/solid";

import {
LineChart,
Line,
ResponsiveContainer,
} from "recharts";

function Dashboard() {

const [licenses, setLicenses] = useState([]);
const [filteredLicenses, setFilteredLicenses] = useState([]);
const [search, setSearch] = useState("");
const [error, setError] = useState("");
const [success, setSuccess] = useState("");

const [name, setName] = useState("");
const [email, setEmail] = useState("");
const [phone, setPhone] = useState("");

const [plan, setPlan] = useState("lifetime");

const [showModal, setShowModal] = useState(false);
const [showDeleteModal, setShowDeleteModal] = useState(false);
const [licenseToDelete, setLicenseToDelete] = useState(null);
const [currentPage, setCurrentPage] = useState(1);

const [selectedLicense, setSelectedLicense] = useState(null);
const [showProfileModal, setShowProfileModal] = useState(false);

const [showResetAlert, setShowResetAlert] = useState(false);

const itemsPerPage = 5;
const token = localStorage.getItem("token");

const fetchLicenses = async () => {

try {

const res = await fetch(`${import.meta.env.VITE_API_URL}/licenses`, {
headers: { Authorization: `Bearer ${token}` },
});

const data = await res.json();

if (!res.ok) throw new Error(data.message);

setLicenses(data);
setFilteredLicenses(data);

} catch (err) {

setError(err.message);

}

};

useEffect(()=>{

fetchLicenses();

const interval = setInterval(() => {
fetchLicenses();
},10000);

return () => clearInterval(interval);

},[]);

useEffect(()=>{

const filtered = licenses.filter((license)=>
license.license_key.toLowerCase().includes(search.toLowerCase())
);

setFilteredLicenses(filtered);

},[search,licenses]);

const handleCreateLicense = async (e)=>{

e.preventDefault();

setError("");
setSuccess("");

try{

const res = await fetch(`${import.meta.env.VITE_API_URL}/licenses`,{

method:"POST",

headers:{
"Content-Type":"application/json",
Authorization:`Bearer ${token}`,
},

body:JSON.stringify({
name,
email,
phone,
plan
})

});

const data = await res.json();

if(!res.ok) throw new Error(data.message);

setSuccess("Licencia creada correctamente");

setName("");
setEmail("");
setPhone("");
setPlan("lifetime");

setShowModal(false);

fetchLicenses();

}catch(err){

setError(err.message);

}

};

const toggleStatus = async (license)=>{

const newStatus =
license.status === "active" ? "inactive" : "active";

await fetch(`${import.meta.env.VITE_API_URL}/licenses/${license.id}/status`,{

method:"PUT",

headers:{
"Content-Type":"application/json",
Authorization:`Bearer ${token}`
},

body:JSON.stringify({status:newStatus})

});

fetchLicenses();

};

const confirmDelete = (license)=>{
setLicenseToDelete(license);
setShowDeleteModal(true);
};

const deleteLicense = async () => {

if(!licenseToDelete) return;

await fetch(`${import.meta.env.VITE_API_URL}/licenses/${licenseToDelete.id}`,{

method:"DELETE",

headers:{ Authorization:`Bearer ${token}` }

});

setShowDeleteModal(false);
setLicenseToDelete(null);

setSuccess("Licencia eliminada correctamente");

setTimeout(()=>{
setSuccess("");
},2000);

await fetchLicenses();

};

const resetAccount = async (license)=>{

await fetch(`${import.meta.env.VITE_API_URL}/licenses/${license.id}/reset`,{

method:"PUT",

headers:{ Authorization:`Bearer ${token}` }

});

await fetchLicenses();

setShowResetAlert(true);

setTimeout(()=>{
setShowResetAlert(false);
},2500);

};

const copyLicense = (key)=>{

navigator.clipboard.writeText(key);
setSuccess("Copiado");

setTimeout(()=>{
setSuccess("");
},2000);

};

const getEAStatus = (lastSeen)=>{

if(!lastSeen) return "OFFLINE";

const last = new Date(lastSeen);
const now = new Date();

const diffMinutes = (now-last)/1000/60;

return diffMinutes < 5 ? "ONLINE":"OFFLINE";

};

const getExpiration = (date)=>{

if(!date) return "Lifetime";

const now = new Date();
const exp = new Date(date);

const diff = Math.ceil((exp-now)/(1000*60*60*24));

if(diff <= 0) return "Expirada";

return diff+" días";

};

const total = licenses.length;
const active = licenses.filter(l=>l.status==="active").length;
const inactive = licenses.filter(l=>l.status==="inactive").length;
const assigned = licenses.filter(l=>l.account_number).length;

const generateChartData = (value)=>
Array.from({length:8},(_,i)=>({name:i,value:i<value?1:0}));

const totalPages = Math.ceil(filteredLicenses.length/itemsPerPage)||1;
const indexOfLast = currentPage*itemsPerPage;
const indexOfFirst = indexOfLast-itemsPerPage;
const currentLicenses = filteredLicenses.slice(indexOfFirst,indexOfLast);

return(

<div className="space-y-8">

{showResetAlert && (
<div className="fixed top-6 right-6 bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg z-50">
Cuenta reseteada correctamente
</div>
)}

{success && <div className="text-green-400 text-sm">{success}</div>}

<div className="grid md:grid-cols-4 gap-6">

<MetricCard title="Total" value={total} color="text-white" chartData={generateChartData(total)} chartColor="#ffffff"/>
<MetricCard title="Activas" value={active} color="text-green-500" chartData={generateChartData(active)} chartColor="#22c55e"/>
<MetricCard title="Inactivas" value={inactive} color="text-red-500" chartData={generateChartData(inactive)} chartColor="#ef4444"/>
<MetricCard title="Asignadas" value={assigned} color="text-blue-400" chartData={generateChartData(assigned)} chartColor="#60a5fa"/>

</div>

<div className="bg-gray-900 p-6 rounded-xl border border-gray-800">

<div className="flex justify-between items-center mb-6">

<button
onClick={()=>setShowModal(true)}
className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-semibold"
>
<PlusIcon className="w-5 h-5"/>
Nueva Licencia
</button>

<div className="relative">

<MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-2.5"/>

<input
type="text"
placeholder="Buscar licencia..."
value={search}
onChange={(e)=>setSearch(e.target.value)}
className="bg-gray-800 border border-gray-700 pl-10 pr-4 py-2 rounded-lg"
/>

</div>

</div>

<table className="w-full text-left text-sm">

<thead className="border-b border-gray-800 text-gray-400">

<tr>
<th>ID</th>
<th>Licencia</th>
<th>Cuenta</th>
<th>Estado</th>
<th>EA</th>
<th>Balance</th>
<th>Expira</th>
<th>Creada</th>
<th>Perfil</th>
<th>Acciones</th>
</tr>

</thead>

<tbody>

{currentLicenses.map((license)=>(

<tr key={license.id} className="border-b border-gray-800 hover:bg-gray-800">

<td className="py-4">{license.id}</td>

<td className="font-mono text-xs py-4 flex items-center gap-2">
{license.license_key}
<button onClick={()=>copyLicense(license.license_key)} className="text-gray-400 hover:text-white">
<ClipboardIcon className="w-4 h-4"/>
</button>
</td>

<td className="py-4">{license.account_number || "Sin asignar"}</td>

<td className="py-4">
<span className={`px-3 py-1 text-xs font-semibold rounded-full ${
license.status==="active"
? "bg-green-600/20 text-green-400"
: "bg-red-600/20 text-red-400"
}`}>
{license.status==="active"?"Activa":"Inactiva"}
</span>
</td>

<td className="py-4 text-xs">

{getEAStatus(license.last_seen)==="ONLINE"
? <span className="text-green-400">🟢 Online</span>
: <span className="text-gray-500">⚫ Offline</span>}

<br/>

<span className="text-gray-500">
{license.last_seen
? new Date(license.last_seen).toLocaleString()
: "Sin conexión"}
</span>

</td>

<td
className="py-4"
title={`Balance: ${license.balance || "N/A"}
Equity: ${license.equity || "N/A"}
Profit: ${license.profit || "N/A"}
Drawdown: ${license.drawdown || "N/A"}%`}
>
{license.balance ?? "-"}
</td>

<td className="py-4 text-xs">{getExpiration(license.expires_at)}</td>

<td className="py-4 text-xs">{getExpiration(license.expires_at)}</td>

<td className="py-4">
{new Date(license.created_at).toLocaleDateString()}
</td>

<td className="py-4">
{new Date(license.created_at).toLocaleDateString()}
</td>

<td className="py-4">
<button
onClick={()=>{
setSelectedLicense({...license});
setShowProfileModal(true);
}}
className="p-2 bg-gray-800 rounded-lg"
>
<UserIcon className="w-4 h-4 text-blue-400"/>
</button>
</td>

<td className="flex gap-2 py-4">

<button
onClick={()=>toggleStatus(license)}
className="bg-yellow-600 px-3 py-1 rounded text-xs"
>
<PowerIcon className="w-4 h-4 inline"/>
</button>

<button
onClick={()=>resetAccount(license)}
className="bg-blue-600 px-3 py-1 rounded text-xs"
>
<ArrowPathIcon className="w-4 h-4 inline"/>
</button>

<button
onClick={()=>confirmDelete(license)}
className="bg-red-600 px-3 py-1 rounded text-xs"
>
<TrashIcon className="w-4 h-4 inline"/>
</button>

</td>

</tr>

))}

</tbody>

</table>

{/* PAGINACION */}

<div className="flex justify-between items-center mt-6">

<p className="text-sm text-gray-400">
Página {currentPage} de {totalPages}
</p>

<div className="flex gap-2">

<button
disabled={currentPage === 1}
onClick={() => setCurrentPage(prev => prev - 1)}
className="px-3 py-1 bg-gray-800 rounded disabled:opacity-40"
>
Anterior
</button>

<button
disabled={currentPage === totalPages}
onClick={() => setCurrentPage(prev => prev + 1)}
className="px-3 py-1 bg-gray-800 rounded disabled:opacity-40"
>
Siguiente
</button>

</div>

</div>

</div>


{/* MODAL NUEVA LICENCIA */}

{showModal && (

<div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">

<div className="bg-gray-900 p-8 rounded-xl w-96 border border-gray-800">

<h2 className="text-xl font-bold mb-6">Crear Nueva Licencia</h2>

<form onSubmit={handleCreateLicense} className="space-y-4">

<input
type="text"
placeholder="Nombre completo"
value={name}
onChange={(e)=>setName(e.target.value)}
required
className="w-full bg-gray-800 px-4 py-2 rounded-lg border border-gray-700"
/>

<input
type="email"
placeholder="Correo electrónico"
value={email}
onChange={(e)=>setEmail(e.target.value)}
required
className="w-full bg-gray-800 px-4 py-2 rounded-lg border border-gray-700"
/>

<input
type="text"
placeholder="Teléfono"
value={phone}
onChange={(e)=>setPhone(e.target.value)}
className="w-full bg-gray-800 px-4 py-2 rounded-lg border border-gray-700"
/>

<select
value={plan}
onChange={(e)=>setPlan(e.target.value)}
className="w-full bg-gray-800 px-4 py-2 rounded-lg border border-gray-700"
>

<option value="monthly">Licencia Mensual</option>
<option value="yearly">Licencia Anual</option>
<option value="lifetime">Licencia Lifetime</option>

</select>

<button className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded-lg font-semibold">
Crear Licencia
</button>

</form>

<button
onClick={()=>setShowModal(false)}
className="mt-4 text-gray-400"
>
Cancelar
</button>

</div>

</div>

)}


{/* MODAL ELIMINAR */}

{showDeleteModal && (

<div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">

<div className="bg-gray-900 p-8 rounded-xl w-96 border border-gray-800">

<h2 className="text-red-500 font-bold mb-4">
Confirmar eliminación
</h2>

<p className="text-gray-400 mb-6">
¿Seguro que deseas eliminar esta licencia?
</p>

<button
onClick={deleteLicense}
className="bg-red-600 px-4 py-2 rounded-lg mr-4"
>
Eliminar
</button>

<button
onClick={()=>setShowDeleteModal(false)}
className="text-gray-400"
>
Cancelar
</button>

</div>

</div>

)}


{/* MODAL PERFIL */}

{showProfileModal && selectedLicense && (

<div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">

<div className="bg-gray-900 p-8 rounded-xl w-96 border border-gray-800">

<h2 className="text-xl font-bold mb-4">
{selectedLicense.name}
</h2>

<p>Email: {selectedLicense.email}</p>

<p>Teléfono: {selectedLicense.phone || "No registrado"}</p>

<p>Cuenta: {selectedLicense.account_number || "No vinculada"}</p>

<p>Estado: {selectedLicense.status}</p>

<button
onClick={()=>{
setShowProfileModal(false);
setSelectedLicense(null);
}}
className="mt-4 text-gray-400"
>

Cerrar

</button>

</div>

</div>

)}

</div>

);

}

function MetricCard({title,value,color,chartData,chartColor}){

return(

<div className="bg-gray-900 p-6 rounded-xl border border-gray-800 flex justify-between items-center">

<div>

<p className="text-gray-400 text-sm">{title}</p>

<h3 className={`text-2xl font-bold ${color}`}>{value}</h3>

</div>

<div className="w-20 h-12">

<ResponsiveContainer width="100%" height="100%">

<LineChart data={chartData}>

<Line type="monotone" dataKey="value" stroke={chartColor} strokeWidth={2} dot={false}/>

</LineChart>

</ResponsiveContainer>

</div>

</div>

);

}

export default Dashboard;