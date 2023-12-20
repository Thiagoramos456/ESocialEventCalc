export class Interpreter1200 {
  getSum(xmls, rubricas, period) {
    let sum = 0;
    const laborersSumMap = {}

    const xmlValues = Object.values(xmls);
    for (let i = 0; i < xmlValues.length; i++) {
      let laborSum = 0;
      const xmlString = xmlValues[i];
      
      const xml = new DOMParser().parseFromString(xmlString, "text/xml");

      const sumItems = xml.getElementsByTagName("itensRemun");
      const cpfTrab = xml.getElementsByTagName("cpfTrab")[0].textContent;
      const perApur = xml.getElementsByTagName("perApur")[0].textContent;
      if (period !== perApur) {
        continue;
      }
      

      for (const item of sumItems) {
        const [vrRubr] = item.getElementsByTagName("vrRubr");
        const [codRubr] = item.getElementsByTagName("codRubr");

        if (!rubricas.includes(codRubr.textContent))
          continue;

        const value = Number(vrRubr.textContent)

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