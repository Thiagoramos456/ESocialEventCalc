import { Interpreter1200 } from './Interpreter1200';
import { Interpreter5002 } from './Interpreter5002';

export const availableEvents = ["1200", "5002"]

export function getInterpreterSum(eventType, rubricas, period, xmls) {
  let interpreter;

  if (eventType === "1200")
    interpreter = new Interpreter1200();

  if (eventType === "5002")
    interpreter = new Interpreter5002();

  const filteredXmls = {}

  for (const key in xmls) {

    if (key.includes(`S-${eventType}`)) {
      filteredXmls[key] = xmls[key];
    }
  }
  

  return interpreter.getSum(filteredXmls, rubricas, period);

}