//selecting a lift type creates a json object with weight info
const selectLift = document.querySelector("#lift-select");

selectLift.addEventListener('change', () => {
    let liftCapacity = JSON.parse(selectLift.value);
    console.log(liftCapacity);
});


//clone nodes to simplify item addition
let counter = 0;
const duplicateDiv = (div) => {
    let dupDiv = div.cloneNode(true);
    dupDiv.children[1].id = dupDiv.children[1].id + counter;
    dupDiv.children[0].for = dupDiv.children[1].id;
    dupDiv.children[3].id = dupDiv.children[3].id + counter;
    dupDiv.children[2].for = dupDiv.children[3].id;
    counter++;
    div.parentNode.appendChild(dupDiv);
};

const newItemBtn = document.querySelectorAll('.add-item');
newItemBtn.forEach(el => el.addEventListener('click', () => {
    duplicateDiv(el.parentNode.previousElementSibling.firstElementChild);
}));


//item divs push to array that sums
let armArray = [];
let basketArray = [];

const addItem = (array, position, value) => {
    if (array.position) {
        array.splice(position, 1, value);
    } else {
        array.push(value);
    }
};

//core weight calculation
const calculateWeight = () => {
    let onArm = armArray.reduce((a, b) => a + b, 0);
    let inBasket = basketArray.reduce((a, b) => a + b, 0);
    let total =  onArm + inBasket;
    return { onArm, inBasket, total };
};