window.onload = init;

let root;
let content;
let stars1;
let stars2;
let stars3;
let zoom = 1.0;
let translateY = 0;
let translateX = 0;
let middleMouseDown = false;

function init(){
    content = document.getElementById("content");
    root = document.getElementById("root");
    stars1 = document.getElementById("stars-one");
    stars2 = document.getElementById("stars-two");
    stars3 = document.getElementById("stars-three");
    transform();

    root.addEventListener("wheel", (event)=>{
        zoom += event.wheelDelta / 2000;
        if(zoom > 3.0){zoom = 3.0}
        else if (zoom < 0.5) {zoom = 0.5};
        // console.log(zoom);

        transform();
    })
    
    root.addEventListener("mousedown", (event)=>{
        event.preventDefault();
        middleMouseDown = (event.button == 1);
    })

    root.addEventListener("mouseup", (event)=>{
        if(event.button == 1){
            middleMouseDown = false;
        }
    })

    root.addEventListener("mousemove", (event)=>{
        // console.log(event);
        if(middleMouseDown){
            translateY += (event.movementY * 0.7);
            translateX += (event.movementX * 0.7);
            transform();
        }
    })

}

function transform(){
    stars1.style.transform = `translate(${-translateX/100}px, ${-translateY/100}px)`;
    stars2.style.transform = `translate(${-translateX/75}px, ${-translateY/75}px)`;
    stars3.style.transform = `translate(${-translateX/60}px, ${-translateY/60}px)`;
    content.style.transform = `scale(${zoom}, ${zoom}) translate(${translateX}px, ${translateY}px)`;
    
}