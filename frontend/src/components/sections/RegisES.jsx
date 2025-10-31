import InputText from "../ui/InputNumber";
import InputCheck from "../ui/InputCheck";
import loadDeliverista from "../../api/api.deliveristas";
import loadProducto from "../../api/api.producto";
import { useState,useEffect } from "react";
import { createSalida } from "../../api/api.salida";

function RegisES({onRegister}) {

  const [loading, setLoading] = useState(false);
  const [dataDe,setDataDe] = useState([]);
  const [dataPro,setDataPro] = useState([]);
  const [formData, setFormData] = useState({
    id_trabajador: "",
    cantidad: "",
    id_producto:""
  });
  
  useEffect(() => {
    async function load(){
      const datax = await loadDeliverista()
      setDataDe(datax.data)
    }
    load();
  },[]);

  useEffect(() => {
    async function loadx(){
      const datax = await loadProducto();
      setDataPro(datax.data)
    }
    loadx();
  },[]);

  const handleInputChange = (nom,value) => {
    setFormData(prev => ({
      ...prev,
      [nom]:value
    }));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createSalida(formData);
      alert("Salida registrada con exito")
      setFormData({
        id_trabajador: "",
        cantidad: "",
        id_producto:""
      });
      if(onRegister) onRegister();
    }catch (error){
      console.error("Error al registrar la salida:", error)
      alert("Error al registrar salida")
    }finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white p-4 rounded-2xl shadow-md mb-6">
      <p className="text-lg font-semibold pb-3">Resgistrar Nueva Salida</p>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-4 gap-4">
          <InputCheck 
            title={"Deliverista"} 
            items={dataDe} 
            value={formData.id_trabajador}
            onChange={(value) => handleInputChange('id_trabajador',value)}/>
          <InputText
            title={"Cantidad"}
            type={"number"}
            descripcion={"Ingrese la cantidad"}
            value={formData.cantidad}
            onChange={(value) => handleInputChange('cantidad',value)}
            />
          <InputCheck 
            title={"Tipo producto"} 
              items={dataPro} 
              value={formData.id_producto}
              onChange={(value) => handleInputChange('id_producto',value)}
              />
          <button
            type="submit"
            disabled={loading} 
            className="bg-green-600 text-white font-semibold h-9 mt-6 rounded-lg">
            {loading ? "Registrando..." : "Registrar"}
          </button>
          
        </div>
      </form>
    </div>
  );
}

export default RegisES;
