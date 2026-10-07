// Basic setTimeout example using global setTimeout (browser-safe)
setTimeout(() => {
  console.log("Hello");
}, 1000);

// More advanced examples with setTimeout

// 1. Using setTimeout with variables
const delay = 2000;
const message = "Hello from variable!";

setTimeout(() => {
  console.log(message);
}, delay);

// 2. Clearing a timeout
const timeoutId = setTimeout(() => {
  console.log("This might not run");
}, 3000);

// Clear the timeout before it executes
clearTimeout(timeoutId);

// 3. Using setTimeout in a function
function delayedGreeting(name, delay = 1000) {
  setTimeout(() => {
    console.log(`Hello, ${name}!`);
  }, delay);
}

delayedGreeting("World", 1500);

// 4. Promise-based delay (modern approach)
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Usage with async/await
async function asyncExample() {
  console.log("Starting...");
  await delay(1000);
  console.log("After 1 second");
  await delay(1000);
  console.log("After 2 seconds");
}

asyncExample();

// 5. Chaining multiple timeouts
setTimeout(() => {
  console.log("First");
  setTimeout(() => {
    console.log("Second");
    setTimeout(() => {
      console.log("Third");
    }, 1000);
  }, 1000);
}, 1000);

// ✅ CORRECT: Use global setTimeout/clearTimeout for browser compatibility
// ❌ NEVER DO: import { setTimeout } from 'node:timers'
// ❌ NEVER DO: timer._onTimeout()