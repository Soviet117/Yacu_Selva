import InputText from "../ui/InputText";

function EndConf(){
    return (
        <div className="bg-white p-4 rounded-2xl space-y-3">
            <p className="text-lg font-semibold pb-3">Seguridad</p>
           <InputText title={"Cambiar Contraseña"} descripcion={"Nueva contraseña"}/>
           <InputText descripcion={"Confirmar contraseña"}/> 
           <button className="bg-green-600 text-white font-semibold h-9 w-50 rounded-lg">
                Confirmar cambio
            </button>
        </div>
    );
}

export default EndConf;