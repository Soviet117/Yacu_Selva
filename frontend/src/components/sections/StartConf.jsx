import InputText from "../ui/InputText";
import InputCheck from "../ui/InputCheck";

function StartConf(){
const dataMo = [
    { id: "soles", nombre: "Soles (S/.)" },
    { id: "dolares", nombre: "Dolares ($)" },
  ];

const dataZH = [
    {id:"lima", nombre: "Lima, Perú (UTC-5)"},
    {id: "rusia", nombre:"Rusia, Moscú (UTC-8)"},
];

    return (
        <div className="bg-white p-4 rounded-2xl space-y-3">  
            <p className="text-lg font-semibold pb-3">Configuración general</p>
            <InputText title={"Nombre de la empresa"} descripcion={"Ingrese el nombre de la empresa"}/>
            <InputCheck title={"Modena"} items={dataMo}/>
            <InputCheck title={"Zona horaria"} items={dataZH}/>
        </div>
    );
}

export default StartConf;