//item selections push to an array
let armArray = [];
let basketArray = [];

const addItem = (array, position, value) => {
    array.splice(position, 1, value);
};

//modifier accounts for weight adjustment factors.
const addItemListen = (element, array, modifier) => {
    element.addEventListener('change', () => {
        let weightValue = element.parentNode.children[1].value * element.parentNode.children[3].value * modifier;
        let posArr = Array.prototype.slice.call(document.querySelectorAll("." + element.parentNode.classList[0]));
        let position = posArr.indexOf(element.parentNode);
        //for some reason only the first in the list has a bug that makes its position -1 when it should be 0
        if (position == -1) {
            position = 0;
        };
        addItem(array, position, weightValue);
        displayWeight();
    });
};


//had to tweak slightly for custom items
const addCustomListen = (element, array, modifier) => {
    element.addEventListener('change', () => {
        let weightValue = element.parentNode.children[3].value * element.parentNode.children[5].value * modifier;
        let posArr = Array.prototype.slice.call(document.querySelectorAll("." + element.parentNode.classList[0]));
        let position = posArr.indexOf(element.parentNode);
        //for some reason only the first in the list has a bug that makes its position -1 when it should be 0
        if (position == -1) {
            position = 0;
        };
        addItem(array, position, weightValue);
        displayWeight();
    });
};

//Delete button removes section div and place in array
const deleteItem = (array, position) => {
  array.splice(position, 1);
  displayWeight();
};

const addDeleteListen = (element, array) => {
    element.addEventListener('click', () => {
        let posArr = Array.prototype.slice.call(document.querySelectorAll("." + element.parentNode.classList[0]));
        let position = posArr.indexOf(element.parentNode);
        //for some reason only the first in the list has a bug that makes its position -1 when it should be 0
        if (position == -1) {
            position = 0;
        };
        if (posArr.length > 1) {
            deleteItem(array, position);
            element.parentNode.parentNode.removeChild(element.parentNode);
            displayWeight();
        };
    });
};

//core weight calculation
const calculateWeight = () => {
    let onArm = armArray.reduce((a, b) => a + b, 0);
    let inBasket = basketArray.reduce((a, b) => a + b, 0);
    if (operator.checked == true) {
        inBasket += 275;
    };
    let total =  onArm + inBasket;
    return { onArm, inBasket, total };
};

//selecting a lift type creates a json object with weight info
const selectLift = document.querySelector("#lift-select");

selectLift.addEventListener('change', () => {
    displayWeight();
});

//add listeners to original divs
const startArmDiv = document.querySelector('.arm-item-div');
addItem(armArray, 0, 0);
addItemListen(startArmDiv.children[1], armArray, 1);
addItemListen(startArmDiv.children[3], armArray, 1);
addDeleteListen(startArmDiv.children[4], armArray);

const startBasketDiv = document.querySelector('.basket-item-div');
addItem(basketArray, 0, 0);
//36" calculation from Matt Ardine's spreadsheet for in basket items means a modifier of 1.37
addItemListen(startBasketDiv.children[1], basketArray, 1.37);
addItemListen(startBasketDiv.children[3], basketArray, 1.37);
addDeleteListen(startBasketDiv.children[4], basketArray);

const operator = document.querySelector('#add-operator');
operator.addEventListener('change', () => {
    displayWeight();
});

//clone nodes to simplify item addition.  Make sure IDs don't replicate
let counter = 0;
const duplicateDiv = (div) => {
    let dupDiv = div.cloneNode(true);
    dupDiv.children[1].id = dupDiv.children[1].id + counter;
    dupDiv.children[0].htmlFor = dupDiv.children[1].id;
    dupDiv.children[3].id = dupDiv.children[3].id + counter;
    dupDiv.children[2].htmlFor = dupDiv.children[3].id;
    counter++;
    div.parentNode.appendChild(dupDiv);
    if (div.classList[0] === "arm-item-div") {
        addItem(armArray, document.querySelectorAll(".arm-item-div").length, 0)
        addItemListen(dupDiv.children[1], armArray, 1);
        addItemListen(dupDiv.children[3], armArray, 1);
        addDeleteListen(dupDiv.children[4], armArray);
    } else {
        //36" calculation from Matt Ardine's spreadsheet for in basket items means a modifier of 1.37
        addItem(basketArray, document.querySelectorAll(".basket-item-div").length, 0)
        addItemListen(dupDiv.children[1], basketArray, 1.37);
        addItemListen(dupDiv.children[3], basketArray, 1.37);
        addDeleteListen(dupDiv.children[4], basketArray);
    };
};

const newItemBtn = document.querySelectorAll('.add-item');
newItemBtn.forEach(el => el.addEventListener('click', () => {
    duplicateDiv(el.parentNode.previousElementSibling.firstElementChild);
}));

//custom item creates a div with user-input weight value and name
const createCustom = (element) => {
    const customDiv = document.createElement('div');
    customDiv.classList.add(element.parentNode.previousElementSibling.firstElementChild.classList[0]);
    element.parentNode.previousElementSibling.appendChild(customDiv);

    //Name input created for user organizational uses - cosmetic only
    const nameInput = document.createElement('input');
    nameInput.id = "custom-name" + counter;
    nameInput.type = "text";
    nameInput.placeholder = "Item";

    const nameLabel = document.createElement('label');
    nameLabel.htmlFor = nameInput.id;
    nameLabel.textContent = "Name:"

    customDiv.appendChild(nameLabel);
    customDiv.appendChild(nameInput);

    const weightInput = document.createElement('input');
    weightInput.id = "custom-weight" + counter;
    weightInput.type = "number";
    weightInput.value = "0";

    const weightLabel = document.createElement('label');
    weightLabel.htmlFor = weightInput.id;
    weightLabel.textContent = "Weight:"

    customDiv.appendChild(weightLabel);
    customDiv.appendChild(weightInput);

    const quantInput = document.createElement('input');
    quantInput.id = "custom-quantity" + counter;
    quantInput.type = "number";
    quantInput.value = "1";

    const quantLabel = document.createElement('label');
    quantLabel.htmlFor = quantInput.id;
    quantLabel.textContent = "Quantity:"

    customDiv.appendChild(quantLabel);
    customDiv.appendChild(quantInput);
    counter++;

    const deleteCustom = document.createElement('button');
    deleteCustom.classList.add("delete-item");
    deleteCustom.textContent = "×";
    customDiv.appendChild(deleteCustom);
    

    if(customDiv.classList[0] === "arm-item-div") {
        addItem(armArray, document.querySelectorAll(".arm-item-div").length, 0)
        addCustomListen(weightInput, armArray, 1);
        addCustomListen(quantInput, armArray, 1);
        addDeleteListen(deleteCustom, armArray);
    } else {
        addItem(basketArray, document.querySelectorAll(".basket-item-div").length, 0)
        addCustomListen(weightInput, basketArray, 1.37);
        addCustomListen(quantInput, basketArray, 1.37);
        addDeleteListen(deleteCustom, basketArray);
    };
};

const customItemBtn = document.querySelectorAll('.add-custom');
customItemBtn.forEach(el => el.addEventListener('click', () => {
    createCustom(el);
}));

//weight info pushes to DOM
const displayWeight = () => {
    let liftCapacity = JSON.parse(selectLift.value);

    const totalsDiv = document.querySelector('#totals');

    const resCap = document.querySelector("#restricted-capacity");
    resCap.innerHTML = liftCapacity.restricted + " lbs"

    const unLimCap = document.querySelector("#unlimited-capacity");
    unLimCap.innerHTML = liftCapacity.unrestricted + " lbs"

    let weightObj = calculateWeight();

    const armWeight = document.querySelector("#display-arm-weight");
    armWeight.innerHTML = Math.round(weightObj.onArm) + " lbs";

    const basketWeight = document.querySelector("#display-basket-weight");
    basketWeight.innerHTML = Math.round (weightObj.inBasket) + " lbs";

    const resWeight = document.querySelector("#restricted-weight");
    resWeight.innerHTML = Math.round(weightObj.total) + " lbs";

    const unLimWeight = document.querySelector("#unlimited-weight");
    unLimWeight.innerHTML = Math.round(weightObj.total) + " lbs";

    const resDiv = document.querySelector('#restricted')
    const unLimDiv = document.querySelector('#unlimited')
    const wgtMsg = document.querySelector('#weight-message');


    //colors change based on if weight is over-capacity
    if (liftCapacity.restricted == 0) {
        resDiv.style.color = "black";
        unLimDiv.style.color = "black";
        wgtMsg.style.color = "black";
        wgtMsg.innerHTML = "Choose a lift!"
    } else if (weightObj.total > liftCapacity.unrestricted && weightObj.total < liftCapacity.restricted) {
        resDiv.style.color = "#339900";
        unLimDiv.style.color = "#cc3300";
        wgtMsg.style.color = "#FF6600";
        wgtMsg.innerHTML = "Restricted movement.  Stay within safe limits."
    } else if (weightObj.total > liftCapacity.restricted) {
        resDiv.style.color = "#cc3300";
        unLimDiv.style.color = "#cc3300";
        wgtMsg.style.color = "#cc3300";
        wgtMsg.innerHTML = "Overweight!"
    } else {
        resDiv.style.color = "#339900";
        unLimDiv.style.color = "#339900";
        wgtMsg.style.color = "#339900";
        wgtMsg.innerHTML = "Good to go!"
    };
};

//show totals from start
displayWeight();