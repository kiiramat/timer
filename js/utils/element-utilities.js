const ElementUtilities = {}

ElementUtilities.createTextInputElement = (id, className, name, placeholder) => {
    const input = document.createElement("input");
    input.setAttribute("type", "text");
    input.setAttribute("id", id);
    input.setAttribute("class", className);
    input.setAttribute("name", name);
    input.setAttribute("placeholder", placeholder);
    return input;
}

ElementUtilities.createNumberInputElement = (className, max, clockSetter, placeholder, func) => {
    const input = document.createElement("input");
    input.setAttribute("class", className);
    input.setAttribute("type", "number");
    input.setAttribute("min", "0");
    input.setAttribute("max", max);
    input.setAttribute("clock-setter", clockSetter);
    input.setAttribute("placeholder", placeholder);
    input.addEventListener('input', (event) => {
        const currentValue = event.target.value;
        event.target.value = Math.max(0, Math.min(Number(currentValue), Number(max)));
        func();
    });
    
    return input;
}


ElementUtilities.createButtonElement = (text, className, func) => {
    const button = document.createElement("button");
    button.innerHTML = text;
    button.className = className;
    button.addEventListener("click", func);

    return button;
}


ElementUtilities.createImage = (className, src) => {
    const img = document.createElement("img");
    img.className = className;
    img.src = src;

    return img;
}

