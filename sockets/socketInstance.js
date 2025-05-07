let socketServiceInstance = null;

export function setSocketInstance(instance) {
  socketServiceInstance = instance;
}

export function getSocketInstance() {
  return socketServiceInstance;
}

export default getSocketInstance;