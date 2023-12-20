import { useState } from 'react';
import { availableEvents, getInterpreterSum } from './interpreters';
import { parseXmlsZip } from './utils';
import JSZip from 'jszip';


function isNumeric(value) {
  return /^-?\d+$/.test(value);
}

function App() {
  const [xmls, setXmls] = useState({});
  const [eventType, setEventType] = useState("1200");
  const [period, setPeriod] = useState("2025-02-20");
  const [rubricasInput, setRubricasInput] = useState("");
  const [rubricas, setRubricas] = useState("");

  const [totalSum, setTotalSum] = useState("");
  const [laborersSum, setLaborersSum] = useState({});
  


  const handleFileChange = (e) => {
    if (e.target.files) {
      loadXmls(e.target.files[0]);
    }
  }

  const loadXmls = (zipFile) => {
    const xmlMap = {}

    JSZip.loadAsync(zipFile).then(async (zip) => {
      const zipFiles = Object.values(zip.files);
    
      for (const file of zipFiles) {
        const name = file.name.split("S-")[1];
    
        if (!name) continue;
        if (!availableEvents.includes(name.replace(".xml", "")))
        continue;
      
        const xmlString = await file.async("string");
        xmlMap[file.name] = xmlString;
      }
      console.log(xmlMap)
      setXmls(xmlMap);
    })
  }

  const onClickCalc = () => {
    console.log(xmls)
    const {sum, laborersSumMap} = getInterpreterSum(eventType, rubricas, period, xmls);
    setTotalSum(sum)
    setLaborersSum(laborersSumMap)
  }

  return (
    <main className="App">
      <h1>Calculadora de Eventos ESocial</h1>

      <div className='file-selection-div'>
        <h3>Selecione o arquivo .ZIP</h3>
        <input type='file' id='file' onChange={handleFileChange} />
      </div>

      <div className='interpreter-selection-div'>
        <h3>Selecione o tipo de evento</h3>
        <select value={eventType} onChange={(e) => setEventType(e.target.value)}>
          { availableEvents.map(event => <option key={event} value={event}>{ `Evento ${event}` }</option>) }
        </select>
      </div>

      <div className='interpreter-selection-div'>
        <h3>Selecione o período</h3>
        <input value={period} onChange={(e) => setPeriod(e.target.value)} type="date"></input>
      </div>

      
      <div className='rubricas-input-div'>
        <h3>Escreva as rúbricas</h3>
        <textarea onChange={(e) => {
            let rubricas = [];
            let actualRubrica = "";
            e.target.value.split('').concat(' ').forEach(char => {
              if (!isNumeric(char)) {
                if (actualRubrica !== "")
                rubricas.push(actualRubrica)
                actualRubrica = ""
                return;
              }
              
              actualRubrica += char;
            });
          setRubricas(rubricas)
        }}></textarea>
      </div>


      <div className='results-div'>
        <button onClick={onClickCalc}>Calcular</button>
      </div>

      <div className='sum-div'>
        <p className='sum-display'>Total: R$ {totalSum}</p>
      </div>

      <div className='laborers-div'>
        <table>
          <tr>
            <th>CPF</th>
            <th>Soma</th>
          </tr>
          <tr>
            { Object.entries(laborersSum).map(laborer => (
              <><tr><td>{laborer[0]}</td><td>{laborer[1]}</td></tr></>
            )) }
          </tr>
        </table>
      </div>

    </main>
  );
}

export default App;
