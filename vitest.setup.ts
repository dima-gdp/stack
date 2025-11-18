// Mock для window.scrollTo
Object.defineProperty(window, 'scrollTo', {
  value: () => {},
  writable: true
});

// Mock для window.URL.createObjectURL
if (typeof global.URL.createObjectURL === 'undefined') {
  global.URL.createObjectURL = () => 'blob:mock-url';
}
if (typeof global.URL.revokeObjectURL === 'undefined') {
  global.URL.revokeObjectURL = () => {};
}

// Mock для Math.random для стабильности тестов
let randomSeed = 0;
Math.random = () => {
  randomSeed = (randomSeed + 0.618033988749895) % 1; // Золотое сечение для лучшего распределения
  return randomSeed;
};

