let imagedatauri;

function readImageURL(input){
    var reader = new FileReader();
    reader.onload = function(e) {
        imagedatauri = e.target?.result;
        console.log(e.target?.result);
    }
    
    reader.readAsDataURL(input.target.files[0])
}

function encodeIMG(){
    return steg.encode("hahaha", imagedatauri)
}