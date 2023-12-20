export class Interpreter5002 {
  getSum(xmls, _rubricas, period) {
    let sum = 0;
    const laborersSumMap = {}

    const xmlValues = Object.values(xmls);
    for (let i = 0; i < xmlValues.length; i++) {
      let laborSum = 0;
      const xmlString = xmlValues[i];
      
      const xml = new DOMParser().parseFromString(xmlString, "text/xml");

      const sumItems = xml.getElementsByTagName("infoIR");
      const cpfTrab = xml.getElementsByTagName("cpfBenef")[0].textContent;
      const perApur = xml.getElementsByTagName("perApur")[0].textContent;


      if (period !== perApur) {
        continue;
      }
      
      for (const item of sumItems) {
        const tpInfoIR = item.getElementsByTagName("tpInfoIR")[0].textContent;
        const valor = item.getElementsByTagName("valor")[0].textContent;

        if (!["31", "32", "33"].includes(tpInfoIR)) {
          continue;
        }

        const value = Number(valor)

        laborSum += value;
      }

      laborersSumMap[cpfTrab] = laborersSumMap[cpfTrab] ? laborersSumMap[cpfTrab] + laborSum : laborSum
      sum += laborSum;
    }

    return {
      sum: sum.toFixed(2),
      laborersSumMap: laborersSumMap
    }
  }
}