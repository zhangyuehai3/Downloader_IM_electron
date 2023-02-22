import store from '../state/IMstate'

export function onRobots (robots) {
  store.commit('updateRobots', robots)
}
