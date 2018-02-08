/* eslint-env jest */
export default (lib) => {
  const {
    createStore,
    simpleObject,
    keyValue,
    compose,
    applyMiddleware,
    when,
    reaction,
    reactions,
  } = lib

  describe('k-ramel', () => {
    const simpleTests = (getStore) => {
      it('should initialized', () => {
        const store = getStore()
        expect(store.getState()).toMatchSnapshot()
      })

      it('should instanciate a keyValue reducer', () => {
        const store = getStore()

        // mutation
        store.data.todos.add({ id: 2, label: 'find a name' })

        // selection
        const todo = store.data.todos.get(2)

        expect({
          state: store.getState(),
          todo,
        }).toMatchSnapshot()
      })

      it('should instanciate a simpleObject reducer', () => {
        const store = getStore()

        // mutation
        store.ui.screens.newTodo.set('finish tests')

        // selection
        const label = store.ui.screens.newTodo.get()

        expect({
          state: store.getState(),
          label,
        }).toMatchSnapshot()
      })
    }

    describe('with plain object', () => {
      const getNewStore = () => createStore({
        data: {
          todos: { type: 'keyValue', key: 'id' },
        },
        ui: {
          screens: {
            newTodo: { type: 'simpleObject' },
          },
        },
      })

      simpleTests(getNewStore)
    })

    describe('with helpers', () => {
      const getNewStore = () => createStore({
        data: {
          todos: keyValue({ key: 'id' }),
        },
        ui: {
          screens: {
            newTodo: simpleObject(),
          },
        },
      })

      simpleTests(getNewStore)
    })

    describe('with raw reducers', () => {
      const getNewStore = () => createStore({
        data: {
          todos: keyValue({ key: 'id' }),
        },
        ui: {
          config: (state = 'defaultState', action) => {
            switch (action.type) {
              case 'SET_CONFIG': return action.payload
              default: return state
            }
          },
          screens: {
            newTodo: simpleObject(),
          },
        },
      })

      simpleTests(getNewStore)

      it('should dispatch action to the raw reducer', () => {
        const store = getNewStore()

        // mutation
        store.dispatch({ type: 'SET_CONFIG', payload: 'new config' })

        // selection
        const { config } = store.getState().ui

        expect({
          state: store.getState(),
          config,
        }).toMatchSnapshot()
      })
    })

    describe('without custom options', () => {
      const getNewStore = options => createStore({
        data: {
          todos: { type: 'keyValue', key: 'id' },
        },
        ui: {
          screens: {
            newTodo: { type: 'simpleObject' },
          },
        },
      }, options)

      describe('middlewares', () => {
        it('should call middlewares', () => {
          const spy = jest.fn()
          const middleware = store => next => (action) => {
            spy({ state: store.getState(), action })
            next(action)
          }
          const store = getNewStore({ enhancer: compose(applyMiddleware(middleware)) })
          store.ui.screens.newTodo.set('new')

          expect({
            state: store.getState(),
            spy: spy.mock.calls,
          }).toMatchSnapshot()
        })
      })

      describe('init', () => {
        it('should init the state', () => {
          const store = getNewStore({
            init: {
              ui: {
                screens: {
                  newTodo: 'initial value!',
                },
              },
            },
          })

          expect({
            state: store.getState(),
          }).toMatchSnapshot()
        })
      })

      describe('hide redux', () => {
        it('should not mutate the state', () => {
          const store = getNewStore({ hideRedux: false })
          store.data.todos.add({ id: '3', label: 'hide-redux' })
          expect({
            state: store.getState(),
          }).toMatchSnapshot()
        })

        it('should dispatch action', () => {
          const store = getNewStore({ hideRedux: false })
          store.dispatch(store.data.todos.add({ id: '3', label: 'hide-redux' }))
          expect({
            state: store.getState(),
            todo: store.data.todos.get(3)(store.getState()),
          }).toMatchSnapshot()
        })
      })
    })
  })

  describe('bugs', () => {
    it('should works with first level reducers', () => {
      const store = createStore({
        label: { type: 'simpleObject' },
      })

      store.label.set('yeah it works')

      expect({
        state: store.getState(),
        label: store.label.get(),
      }).toMatchSnapshot()
    })
  })

  describe('listen middleware', () => {
    it('should give drivers', () => {
      const dumbDriver = jest.fn()

      const store = createStore({
        config: { type: 'simpleObject' },
      }, {
        listeners: [
          when('DISPATCHED')((action, st, drivers) => {
            drivers.dumbDriver('I am called with a dumb driver')
          }),
        ],
        drivers: {
          dumbDriver: (/* store */) => dumbDriver,
        },
      })

      store.dispatch({ type: 'DISPATCHED' })

      expect({
        dumbDriver: dumbDriver.mock.calls,
      }).toMatchSnapshot()
    })

    it('should works with others middlewares', () => {
      const spyCatch = jest.fn()
      const store = createStore({
        config: { type: 'simpleObject' },
      }, {
        enhancer: compose(applyMiddleware(() => next => action => next(action))),
        listeners: [
          when(/SET>CONFIG/)(spyCatch),
        ],
      })

      store.config.set('this is dispatched !')

      expect(spyCatch.mock.calls.length).toBe(1)
    })

    it('should still dispatch events', () => {
      const store = createStore({
        config: { type: 'simpleObject' },
      }, {
        listeners: [jest.fn()],
      })

      store.config.set('this is dispatched !')

      expect({
        state: store.getState(),
        config: store.config.get(),
      }).toMatchSnapshot()
    })

    it('should not catch action', () => {
      const spy = jest.fn()
      const store = createStore({
        config: { type: 'simpleObject' },
      }, {
        listeners: [when('NO_CATCH')(spy)],
      })

      store.config.set('this is dispatched !')

      expect(spy.mock.calls.length).toBe(0)
    })

    it('should catch action -regexp-', () => {
      const spyCatch = jest.fn()
      const spyNoCatch = jest.fn()
      const store = createStore({
        config: { type: 'simpleObject' },
      }, {
        listeners: [
          when(/SET>CONFIG/)(spyCatch),
          when(/OUPS>CONFIG/)(spyNoCatch),
        ],
      })

      store.config.set('this is dispatched !')

      expect(spyCatch.mock.calls.length).toBe(1)
      expect(spyNoCatch.mock.calls.length).toBe(0)
      expect(spyCatch.mock.calls[0]).toMatchSnapshot()
    })

    it('should catch action -string-', () => {
      const spyCatch = jest.fn()
      const spyNoCatch = jest.fn()
      const store = createStore({
        config: { type: 'simpleObject' },
      }, {
        listeners: [
          when('@@krf/SET>CONFIG')(spyCatch),
          when('@@oups/SET>CONFIG')(spyCatch),
        ],
      })

      store.config.set('this is dispatched !')

      expect(spyCatch.mock.calls.length).toBe(1)
      expect(spyNoCatch.mock.calls.length).toBe(0)
    })

    it('should catch action -function-', () => {
      const spyFilter = jest.fn(() => true)
      const spyCatch = jest.fn()
      const spyNoCatch = jest.fn()
      const store = createStore({
        config: { type: 'simpleObject' },
      }, {
        listeners: [
          when(spyFilter)(spyCatch),
          when(() => false)(spyCatch),
        ],
      })

      store.config.set('this is dispatched !')

      expect(spyCatch.mock.calls.length).toBe(1)
      expect(spyNoCatch.mock.calls.length).toBe(0)
      expect(spyFilter.mock.calls.length).toBe(1)
      expect(spyFilter.mock.calls[0]).toMatchSnapshot()
    })

    it('should catch action with multiple matchers', () => {
      const spyCatch = jest.fn()
      const spyNoCatch = jest.fn()
      const store = createStore({
        config: { type: 'simpleObject' },
      }, {
        listeners: [
          when(() => true, () => true)(spyCatch),
          when(() => false, () => true)(spyNoCatch),
          when(() => true, () => false)(spyNoCatch),
          when(() => false, () => false)(spyNoCatch),
          when(() => true, () => true)(spyCatch),
        ],
      })

      store.config.set('this is dispatched !')

      expect(spyCatch.mock.calls.length).toBe(2)
      expect(spyNoCatch.mock.calls.length).toBe(0)
    })

    it('should catch and dispatch a new action', () => {
      const spy = jest.fn()
      const store = createStore({
        config: { type: 'simpleObject' },
        saved: { type: 'simpleObject' },
      }, {
        listeners: [
          when(/SET>SAVED/)(spy),
          when(/SET>CONFIG/)((action, innerStore) => { innerStore.saved.set('SET_CONFIG is triggered :)') }),
        ],
      })

      store.config.set('this is dispatched !')

      expect(spy.mock.calls.length).toBe(1)
      expect({
        state: store.getState(),
      }).toMatchSnapshot()
    })

    it('should catch action decorated by reaction hof', () => {
      const spyCatch = jest.fn()
      const spyNoCatch = jest.fn()
      const store = createStore({
        config: { type: 'simpleObject' },
      }, {
        listeners: [
          when(/SET>CONFIG/)(reaction(spyCatch)),
          when(/OUPS>CONFIG/)(reaction(spyNoCatch)),
        ],
      })

      store.config.set('this is dispatched !')

      expect(spyCatch.mock.calls.length).toBe(1)
      expect(spyNoCatch.mock.calls.length).toBe(0)
      expect(spyCatch.mock.calls[0]).toMatchSnapshot()
    })

    it('should catch action decorated by reaction hof, DSL way', () => {
      const spyCatch = reaction(jest.fn())
      const spyNoCatch = reaction(jest.fn())
      const store = createStore({
        config: { type: 'simpleObject' },
      }, {
        listeners: [
          spyCatch.when(/SET>CONFIG/),
          spyNoCatch.when(/OUPS>CONFIG/),
        ],
      })

      store.config.set('this is dispatched !')

      expect(spyCatch.mock.calls.length).toBe(1)
      expect(spyNoCatch.mock.calls.length).toBe(0)
      expect(spyCatch.mock.calls[0]).toMatchSnapshot()
    })

    it('should catch action decorated by reaction hof, DSL way, with multiple keys', () => {
      const { spyCatch, spyNoCatch } = reactions({
        spyCatch: jest.fn(),
        spyNoCatch: jest.fn(),
      })

      const store = createStore({
        config: { type: 'simpleObject' },
      }, {
        listeners: [
          spyCatch.when(/SET>CONFIG/),
          spyNoCatch.when(/OUPS>CONFIG/),
        ],
      })

      store.config.set('this is dispatched !')

      expect(spyCatch.mock.calls.length).toBe(1)
      expect(spyNoCatch.mock.calls.length).toBe(0)
      expect(spyCatch.mock.calls[0]).toMatchSnapshot()
    })
  })

  describe('redux devtools', () => {
    const { devToolsExtension } = window
    afterEach(() => {
      window.devToolsExtension = devToolsExtension
    })

    it('should add redux devtools to middlewares [w/o name, w/o enhancer]', () => {
      const enhancer = jest.fn(f => f)
      window.devToolsExtension = jest.fn(() => enhancer)

      createStore({ dumb: { type: 'simpleObject' } })
      expect({
        devToolsExtension: window.devToolsExtension.mock.calls,
        devToolsEnhancer: enhancer.mock.calls,
      }).toMatchSnapshot()
    })

    it('should add redux devtools to middlewares [w name, w/o enhancer]', () => {
      const enhancer = jest.fn(f => f)
      window.devToolsExtension = jest.fn(() => enhancer)

      createStore({ dumb: { type: 'simpleObject' } }, { name: 'my-store' })
      expect({
        devToolsExtension: window.devToolsExtension.mock.calls,
        devToolsEnhancer: enhancer.mock.calls,
      }).toMatchSnapshot()
    })

    it('should add redux devtools to middlewares [w name, w enhancer]', () => {
      const otherEnhancer = jest.fn(f => f)
      const enhancer = jest.fn(f => f)
      window.devToolsExtension = jest.fn(() => enhancer)

      createStore({ dumb: { type: 'simpleObject' } }, { enhancer: otherEnhancer, name: 'my-store' })
      expect({
        devToolsExtension: window.devToolsExtension.mock.calls,
        devToolsEnhancer: enhancer.mock.calls,
        otherEnhancer: otherEnhancer.mock.calls,
      }).toMatchSnapshot()
    })

    it('should not add redux devtools to middlewares', () => {
      const enhancer = jest.fn(f => f)
      window.devToolsExtension = jest.fn(() => enhancer)

      createStore({ dumb: { type: 'simpleObject' } }, { devtools: false })
      expect({
        devToolsExtension: window.devToolsExtension.mock.calls,
        devToolsEnhancer: enhancer.mock.calls,
      }).toMatchSnapshot()
    })
  })

  describe('dispatch', () => {
    const customReducer = (state = '', action) => {
      switch (action.type) {
        case 'SET_DUMB': return 'ok !'
        default: return state
      }
    }
    const newStore = () => createStore({ dumb: customReducer })

    it('should dispatch a classic action', () => {
      const store = newStore()

      const before = store.getState()
      const dispatch = store.dispatch({ type: 'SET_DUMB' })
      const after = store.getState()

      expect({
        before,
        dispatch,
        after,
      }).toMatchSnapshot()
    })

    it('should dispatch string as a classic redux action', () => {
      const store = newStore()

      const before = store.getState()
      const dispatch = store.dispatch('SET_DUMB')
      const after = store.getState()

      expect({
        before,
        dispatch,
        after,
      }).toMatchSnapshot()
    })
  })

  describe('drivers', () => {
    describe('http', () => {
      const { fetch } = (global || window)
      afterEach(() => {
        if (global) global.fetch = fetch
        if (window) window.fetch = fetch
      })

      it('should safely fail to parse json', async () => {
        // mock
        const mockedFetch = jest.fn(url => Promise.resolve({
          json: () => { throw new Error(`oups-json-${url}`) },
        }));
        (global || window).fetch = mockedFetch

        // dispatch spy
        const spy = jest.fn()

        // wait
        let resolver
        const wait = new Promise((resolve) => { resolver = resolve })

        // store
        const store = createStore({
          config: { type: 'simpleObject' },
        }, {
          listeners: [
            when('DISPATCHED')(async (action, st, { http }) => {
              await http('GOOGLE')('http://google.fr', { headers: { 'Content-Type': 'application/json' } })
              resolver()
            }),
            when(() => true)(action => spy(action)),
          ],
        })

        // dispatch event
        store.dispatch({ type: 'DISPATCHED' })
        await wait

        // assert
        expect({
          dispatch: spy.mock.calls,
          fetch: mockedFetch.mock.calls,
        }).toMatchSnapshot()
      })


      it('should safely fail to request', async () => {
        // mock
        const mockedFetch = jest.fn((url) => { throw new Error(`oups-${url}`) });
        (global || window).fetch = mockedFetch

        // dispatch spy
        const spy = jest.fn()

        // wait
        let resolver
        const wait = new Promise((resolve) => { resolver = resolve })

        // store
        const store = createStore({
          config: { type: 'simpleObject' },
        }, {
          listeners: [
            when('DISPATCHED')(async (action, st, { http }) => {
              await http('GOOGLE')('http://google.fr')
              resolver()
            }),
            when(() => true)(action => spy(action)),
          ],
        })

        // dispatch event
        store.dispatch({ type: 'DISPATCHED' })
        await wait

        // assert
        expect({
          dispatch: spy.mock.calls,
          fetch: mockedFetch.mock.calls,
        }).toMatchSnapshot()
      })

      it('should fetch data and dispatch a FAILED', async () => {
        // mock
        const mockedFetch = jest.fn(url => Promise.resolve({
          status: 404,
          url,
        }));
        (global || window).fetch = mockedFetch

        // dispatch spy
        const spy = jest.fn()

        // wait
        let resolver
        const wait = new Promise((resolve) => { resolver = resolve })

        // store
        const store = createStore({
          config: { type: 'simpleObject' },
        }, {
          listeners: [
            when('DISPATCHED')(async (action, st, { http }) => {
              await http('GOOGLE')('http://google.fr')
              resolver()
            }),
            when(() => true)(action => spy(action)),
          ],
        })

        // dispatch event
        store.dispatch({ type: 'DISPATCHED' })
        await wait

        // assert
        expect({
          dispatch: spy.mock.calls,
          fetch: mockedFetch.mock.calls,
        }).toMatchSnapshot()
      })

      it('should fetch data and calls json()', async () => {
        // mock
        const mockedFetch = jest.fn(url => Promise.resolve({
          json: () => Promise.resolve({ result: url }),
        }));
        (global || window).fetch = mockedFetch

        // dispatch spy
        const spy = jest.fn()

        // wait
        let resolver
        const wait = new Promise((resolve) => { resolver = resolve })

        // store
        const store = createStore({
          config: { type: 'simpleObject' },
        }, {
          listeners: [
            when('DISPATCHED')(async (action, st, { http }) => {
              await http('GOOGLE')('http://google.fr', { headers: { 'Content-Type': 'application/json' } })
              resolver()
            }),
            when(() => true)(action => spy(action)),
          ],
        })

        // dispatch event
        store.dispatch({ type: 'DISPATCHED' })
        await wait

        // assert
        expect({
          dispatch: spy.mock.calls,
          fetch: mockedFetch.mock.calls,
        }).toMatchSnapshot()
      })

      it('should fetch data an trigger common events', async () => {
        // mock
        const mockedFetch = jest.fn(url => Promise.resolve({
          json: () => Promise.resolve({ result: url }),
        }));
        (global || window).fetch = mockedFetch

        // dispatch spy
        const spy = jest.fn()

        // wait
        let resolver
        const wait = new Promise((resolve) => { resolver = resolve })

        // store
        const store = createStore({
          config: { type: 'simpleObject' },
        }, {
          listeners: [
            when('DISPATCHED')(async (action, st, { http }) => {
              await http('GOOGLE')('http://google.fr')
              resolver()
            }),
            when(() => true)(action => spy(action)),
          ],
        })

        // dispatch event
        store.dispatch({ type: 'DISPATCHED' })
        await wait

        // assert
        expect({
          dispatch: spy.mock.calls,
          fetch: mockedFetch.mock.calls,
        }).toMatchSnapshot()
      })
    })
  })
}