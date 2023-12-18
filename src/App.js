import JSZip from 'jszip';
import { useEffect, useRef, useState } from 'react';

function App() {
  const [xmls, setXmls] = useState([]);


  const handleFileChange = (e) => {
    if (e.target.files) {
      loadXmls(e.target.files[0]);
    }
  }

  const loadXmls = async (zipFile) => {
    JSZip.loadAsync(zipFile).then(async (zip) => {
      const xmlsParsed = Object.values(zip.files).map(file => {
        return file.async("string");
      });

      const xmlList = await Promise.all(xmlsParsed)
      setXmls(xmlList)
    })
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
        <select>
          <option value="1200">Evento 1200</option>
          <option value="5002">Evento 5002</option>
        </select>
      </div>

      <div className='interpreter-selection-div'>
        <h3>Selecione o período</h3>
        <input type="date"></input>
      </div>

      <div className='results-div'>
        <button onClick={}>Calcular</button>
      </div>

    </main>
  );
}

export default App;
