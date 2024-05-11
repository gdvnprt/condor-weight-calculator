//selecting a lift type creates a json object with weight info

const selectLift = document.querySelector("#lift-select");

selectLift.addEventListener('change', () => {
    let liftCapacity = JSON.parse(selectLift.value);
    console.log(liftCapacity);
});