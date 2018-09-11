import { createStore, applyMiddleware, compose } from 'redux'
import createSagaMiddleware from 'redux-saga'
import reduxReset from 'redux-reset'
import reducers from '../reducers'
import rootSaga from '../sagas'

const sagaMiddleware = createSagaMiddleware()

export function configuredStore() {
  const store = createStore(
    reducers,
    compose(
      applyMiddleware(
        sagaMiddleware,
      ),
      reduxReset({
        type: 'INITIALIZE_APP'
      }),
      window.devToolsExtension ? window.devToolsExtension() : f => f
    )
  )

  sagaMiddleware.run(rootSaga)

  return store
}
