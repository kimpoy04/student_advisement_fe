class Memory {
  save = (key, value) => {
    localStorage.setItem(key, value);
  };

  remove = (key) => {
    localStorage.removeItem(key);
  };

  get = (key) => {
    return localStorage.getItem(key);
  };

  clear = () => {
    localStorage.clear();
  };
}

const mem = new Memory();
export default mem;
