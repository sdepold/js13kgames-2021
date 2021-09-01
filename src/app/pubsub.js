const cache = {};

export function pub(a, b, c, d) {
  //pub takes 2 params: a string for the event name an optional object to be passed to the function subscribed
  for (d = -1, c = [].concat(cache[a]); c[++d]; ) c[d](b); //loop on function registered on that event ed executing each one passing the optional object
} //won't break if no subscription on that event

export function sub(a, b) {
  //sub takes 2 params: a string for the event name and a function to be executed when the event is published
  (cache[a] || (cache[a] = [])).push(b); //push the function to the array tied to that event (create the array if does not exist)
}
