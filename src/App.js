import { useEffect, useState } from 'react';
import { availableEvents, getInterpreterSum } from './interpreters';
import JSZip from 'jszip';
import { Box, Button, Container, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';


function isAlphanumeric(value) {
  return /^[0-9a-zA-Z]+$/.test(value);
}

function App() {
  const [xmls, setXmls] = useState({});
  const [eventType, setEventType] = useState("1200");
  const [period, setPeriod] = useState();
  const [rubricas, setRubricas] = useState("");
  const [possiblePeriods, setPossiblePeriods] = useState([]);

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
      setXmls(xmlMap);

      getApurationPossiblePeriods(xmlMap);
    })
  }

  const getApurationPossiblePeriods = (xmls) => {
    const possiblePeriods = [];
    Object.entries(xmls).forEach(xml => {
      const fileName = xml[0];
      const xmlString = xml[1];

      if (!fileName.includes(`S-${eventType}`))
        return;

      const xmlParsed = new DOMParser().parseFromString(xmlString, "text/xml");

      const perApur = xmlParsed.getElementsByTagName("perApur")[0].textContent;
      
      if (!possiblePeriods.includes(perApur)) {
        possiblePeriods.push(perApur);
      }
    });
    setPossiblePeriods(possiblePeriods)
    setPeriod (possiblePeriods[0])
  }

  useEffect(() => {
    getApurationPossiblePeriods(xmls)
  }, [eventType])

  const onClickCalc = () => {
    const {sum, laborersSumMap} = getInterpreterSum(eventType, rubricas, period, xmls);
    setTotalSum(sum)
    setLaborersSum(laborersSumMap)
  }

  return (
    <Container className="App">
      <h1>Calculadora de Eventos ESocial</h1>

      <Box className='file-selection-div'>
        <h2>Selecione o arquivo .ZIP</h2>
        <input type='file' id='file' onChange={handleFileChange} />
      </Box>

      <Box className='interpreter-selection-div'>
        <h2>Selecione o tipo de evento</h2>
        <Select value={eventType} onChange={(e) => setEventType(e.target.value)}>
          { availableEvents.map(event => <MenuItem key={event} value={event}>{ `Evento ${event}` }</MenuItem >) }
        </Select>
      </Box>

      {
        possiblePeriods.length > 0 &&
        <Box className='interpreter-selection-div'>
          <h2>Selecione o período</h2>
          <Select label="Período de Apuração" value={period} onChange={(e) => setPeriod(e.target.value)}>
            { possiblePeriods.map(period => <MenuItem key={period} value={period}>{period}</MenuItem>) }
          </Select>
        </Box>
      }

      {
        eventType === "1200" &&
        <Box className='rubricas-input-div'>
          <h2>Escreva as rúbricas</h2>
          <textarea onChange={(e) => {
              let rubricas = [];
              let actualRubrica = "";
              e.target.value.split('').concat(' ').forEach(char => {
                if (!isAlphanumeric(char)) {
                  if (actualRubrica !== "")
                  rubricas.push(actualRubrica)
                  actualRubrica = ""
                  return;
                }
                
                actualRubrica += char;
              });
            setRubricas(rubricas)
          }}></textarea>
        </Box>
      }


      <Box my={5} className='results-div'>
        <Button variant="contained" onClick={onClickCalc}>Calcular</Button>
      </Box>

      <Box className='sum-div'>
        <p className='sum-display'>Total: R$ {totalSum}</p>
      </Box>

      <div className='laborers-div'>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>CPF</TableCell>
                <TableCell>Soma</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              { Object.entries(laborersSum).map(laborer => (
                <TableRow key={laborer[0]}>
                  <TableCell>{laborer[0]}</TableCell>
                  <TableCell>{laborer[1].toFixed(2)}</TableCell>
                </TableRow>
              )) }
            </TableBody>
          </Table>
        </TableContainer>
      </div>

    </Container>
  );
}

export default App;
