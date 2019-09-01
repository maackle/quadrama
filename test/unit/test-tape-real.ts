const sinon = require('sinon')
const test = require('tape')

import { Orchestrator } from '../../src'
import { tapeExecutor } from '../../src/middleware'
import { genConfigArgs, spawnConductor } from '../common'
import logger from '../../src/logger';
import { delay } from '../../src/util';

const orchestrator = new Orchestrator({
  spawnConductor, genConfigArgs,
  middleware: tapeExecutor(test)
})

const testRan = sinon.spy()


orchestrator.registerScenario.skip('real tape scenario #1', async (s, t) => {
  await delay(1000)
  t.equal(typeof s.conductors, 'function')
  testRan(1)
})

orchestrator.registerScenario.skip('real tape scenario #2', async (s, t) => {
  t.equal(typeof s.conductors, 'function')
  testRan(2)
})

orchestrator.run().then(stats => {
  const valid = testRan.firstCall.calledWith(1) && testRan.secondCall.calledWith(2)
  if (!valid) {
    logger.error("Real tape tests are broken! Please fix them.")
    process.exit(-1)
  }
})
