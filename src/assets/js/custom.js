let imagedatauri;
let imagedatauri2;

function readImageURL(event){
    var reader = new FileReader();
    reader.onload = function(e) {
        imagedatauri = e.target?.result;
    }
    
    reader.readAsDataURL(event.target.files[0])
}

function encodeIMG(message){
    console.log(imagedatauri)
    return steg.encode(message, imagedatauri)
}

function decodeIMG(){
    console.log(imagedatauri)
    return steg.decode(imagedatauri)
}