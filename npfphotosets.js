/* npfPhotosets() v2.2.0 made by codematurgy@tumblr */
            
var rowFunctionAttached = false;

function npfPhotosets(selector, options) {
    if (typeof selector === "string") { var postCollection = document.querySelectorAll(selector); } else { var postCollection = selector; }
    if (!options.hasOwnProperty('includeCommonPhotosets')) { options.includeCommonPhotosets = false; }
    if (!options.hasOwnProperty('useTumblrLightbox')) { options.useTumblrLightbox = false; }
    if (options.photosetMargins == "" || !isNaN(options.photosetMargins)) {
        /* general margin options */
        if (options.photosetMargins == "") {
            var defaultMargin = true;
            var usedUnit = "%";
            var usedMargin = 1.4;
        } else {
            var defaultMargin = false;
            var usedUnit = "px";
            var usedMargin = options.photosetMargins;
        }
    
        /* functions used */
        function hasClass(element, desiredClass) {
            return (new RegExp("^" + desiredClass + " ").test(element.className) || new RegExp(" " + desiredClass + "$").test(element.className) || new RegExp(" " + desiredClass + " ").test(element.className) || new RegExp("^" + desiredClass + "$").test(element.className));
        }
        function isInArray(value, array) { return array.indexOf(value) >= 0; }
        function arrayElementHasClass(element, index, array) {
            return (new RegExp("^" + this + " ").test(element.className) || new RegExp(" " + this + "$").test(element.className) || new RegExp(" " + this + " ").test(element.className) || new RegExp("^" + this + "$").test(element.className));
        }
        function findAncestor(element, desiredClass) {
            while ((element = element.parentNode) && element.className.indexOf(desiredClass) < 0); return element;
        }
        
        /* format existing photosets */
        if (options.includeCommonPhotosets === true) {
            unformattedPhotosets = [];
            for (i = 0; i < postCollection.length; i++) {
                var unformattedList = postCollection[i].querySelectorAll("." + options.generatedPhotosetContainerClass);
                for (j = 0; j < unformattedList.length; j++) { unformattedPhotosets.push(unformattedList[j]); }
            }
            
            for (i = 0; i < unformattedPhotosets.length; i++) {
                var photosetLayout = unformattedPhotosets[i].getAttribute("data-layout");
                var unformattedPhotosetsImages = unformattedPhotosets[i].querySelectorAll("." + options.imageContainerClass);
                for (j = 0; j < unformattedPhotosetsImages.length; j++) {
                    var currentPhotosetRow = parseInt(photosetLayout.slice(0, 1));
                    if (currentPhotosetRow !== "1") {
                        var row = document.createElement("div");
                        row.className = options.rowClass;
                        unformattedPhotosets[i].insertBefore(row, unformattedPhotosetsImages[j]);
                        for (k = j; k < j + currentPhotosetRow; k++) { row.appendChild(unformattedPhotosetsImages[k]); }
                    }
                    j = j + (currentPhotosetRow - 1);
                    photosetLayout = photosetLayout.slice(1);
                }
            }
        }
    
        /* selecting possible photoset elements */
        for(i = 0; i < postCollection.length; i++) {
            rowsAndImages = [];
            var possibleDiv = postCollection[i].querySelectorAll("." + options.rowClass + ", ." + options.imageContainerClass);
        
            for (j = 0; j < possibleDiv.length; j++) {
                if (!hasClass(possibleDiv[j].parentNode, options.generatedPhotosetContainerClass) && (hasClass(possibleDiv[j], options.rowClass) || (hasClass(possibleDiv[j], options.imageContainerClass) && possibleDiv[j].getElementsByTagName("img").length > 0 && !hasClass(possibleDiv[j].parentNode, options.rowClass)))) { rowsAndImages.push(possibleDiv[j]); }
            }
        
            photosetGroups = [];
            if (rowsAndImages.length) {
                /* separating elements into respective photoset arrays */
                photosetGroups.push(new Array());
                j = 0;
                for (k = 0; j < rowsAndImages.length; ) {
                    for (; j < rowsAndImages.length; j++) {
                        photosetGroups[k].push(rowsAndImages[j]);
                        if ((rowsAndImages[j].nextSibling === null || rowsAndImages[j].nextSibling !== rowsAndImages[j + 1]) && rowsAndImages[j + 1] !== undefined) { k++; photosetGroups.push(new Array()); }
                    }
                }
        
                /* generate photosets */
                for (j = 0; j < photosetGroups.length; j++) {
                    var photosetElement = photosetGroups[j];
                    if (photosetElement.length > 1 || (photosetElement.length === 1 && hasClass(photosetElement[0], options.rowClass))) {
                        for (k = 0; k < photosetElement.length; k++) {
                            if (k === 0) {
                                var generatePhotosetContainer = document.createElement("div");
                                generatePhotosetContainer.className = options.generatedPhotosetContainerClass;
                                photosetElement[k].parentNode.insertBefore(generatePhotosetContainer, photosetElement[k]);
                                generatePhotosetContainer.appendChild(photosetElement[k]);
                            } else { photosetElement[k].previousSibling.appendChild(photosetElement[k]); }
                        }
                    }
                }
            }
        
            /* styling */
            var basicPhotosets = postCollection[i].querySelectorAll("." + options.generatedPhotosetContainerClass);
            for (j = 0; j < basicPhotosets.length; j++) {
                /* image container styling */
                var currentPhotosetImages = basicPhotosets[j].querySelectorAll("." + options.imageContainerClass);
                for (k = 0; k < currentPhotosetImages.length; k++) {
                    var singularImage = currentPhotosetImages[k].getElementsByTagName("img")[0];
                    if (!hasClass(singularImage, options.imageClass)) { singularImage.className += " " + options.imageClass; }
                }
        
                /* row-specific styling */
                var currentPhotosetRows = basicPhotosets[j].children;
                for (k = 0; k < currentPhotosetRows.length; k++) {
            
                    /* style row with more than one image */
                    if (currentPhotosetRows[k].className == options.rowClass) {
                        /* style row images */
                        var currentRowImages = currentPhotosetRows[k].querySelectorAll("." + options.imageContainerClass);
                        for (l = 0; l < currentRowImages.length; l++) {
                            var amountOfImages = currentPhotosetRows[k].children.length;
                            if (l < currentRowImages.length - 1) {
                                currentRowImages[l].style.marginRight = usedMargin + usedUnit;
                            }
                            /* image container width */
                            if (defaultMargin === true) {
                                currentRowImages[l].style.width = ((100 - (usedMargin * (amountOfImages - 1))) / amountOfImages) + usedUnit;
                            } else {
                                currentRowImages[l].style.width = ((currentPhotosetRows[k].clientWidth - (usedMargin * (amountOfImages - 1))) / amountOfImages) + "px";
                            }
                            /* insertion of gallery indicators */
                            if (options.insertGalleryIndicator) {
                                var generateGalleryIndicator = document.createElement("div");
                                generateGalleryIndicator.className = options.galleryIndicatorClass;
                                generateGalleryIndicator.innerHTML = options.galleryIndicatorContent;
                                currentRowImages[l].appendChild(generateGalleryIndicator);
                            }
                        }
                    }
            
                    /* style row margin */
                    if (k < currentPhotosetRows.length - 1) {
                        currentPhotosetRows[k].style.marginBottom = usedMargin + usedUnit;
                    }
            
                }
                if (defaultMargin === true) { basicPhotosets[j].className += " adaptable_" + options.generatedPhotosetContainerClass; }
            }
        }
    
        /* function for row styling dependent on wrapper width */
        function styleRow() {
            var photosets = document.getElementsByClassName("npf_photoset");
            for (j = 0; j < photosets.length; j++) {
                var currentRow = photosets[j].querySelectorAll("." + options.rowClass);
                /* image container width */
                if (!hasClass(photosets[j], "adaptable_" + options.generatedPhotosetContainerClass)) {
                    for (k = 0; k < currentRow.length; k++) {
                        var currentRowImageContainers = currentRow[k].querySelectorAll("." + options.imageContainerClass);
                        for (l = 0; l < currentRowImageContainers.length; l++) { currentRowImageContainers[l].style.width = ((parseInt(window.getComputedStyle(currentRow[k]).width, 10) - (options.photosetMargins * (currentRowImageContainers.length - 1))) / currentRowImageContainers.length) + "px"; }
                    }
                }
                
                /* image container height */
                for (k = 0; k < currentRow.length; k++) {
                    var currentRowImages = currentRow[k].querySelectorAll("." + options.imageClass);
                    var currentRowImagesHeight = [];
                    for(l = 0; l < currentRowImages.length; l++) { currentRowImagesHeight.push(currentRowImages[l].offsetHeight); }
                    var rowHeight = Math.min.apply(null, currentRowImagesHeight);
                    for(l = 0; l < currentRowImages.length; l++) {
                        findAncestor(currentRowImages[l], options.imageContainerClass).style.height = rowHeight + parseInt(window.getComputedStyle(findAncestor(currentRowImages[l], options.imageContainerClass)).getPropertyValue("border-top-width"), 10) + parseInt(window.getComputedStyle(findAncestor(currentRowImages[l], options.imageContainerClass)).getPropertyValue("border-bottom-width"), 10) + "px";
                        currentRowImages[l].style.marginTop = "-" + ((currentRowImages[l].offsetHeight - rowHeight) / 2) + "px";
                    }
                }
            }
        }
        
        /* create image collection */
        
        var imageCollection = [];
        
        for (i = 0; i < postCollection.length; i++) {
            var images = postCollection[i].querySelectorAll("." + options.generatedPhotosetContainerClass + " ." + options.imageClass);
            for (j = 0; j < images.length; j++) { imageCollection.push(images[j]); }
        }
        
        /* attach load and resize function for rows */
    
        if (rowFunctionAttached === false) {
            window.addEventListener("load", styleRow, false);
            window.addEventListener("resize", styleRow, false);
            rowFunctionAttached = true;
        } else {
            var loadCheck = 0;
        function hasLoaded(list) { loadCheck++; if (loadCheck === list.length) { styleRow(); } }
            for (i = 0; i < imageCollection.length; i++) { imageCollection[i].onload = function() { hasLoaded(imageCollection); } }
        }
        
        /* attach lightbox function */
        
        if (options.useTumblrLightbox === true) {
            function removeDefaultLightbox() {
                var imagesWithDefaultLightbox = document.querySelectorAll("." + options.rowClass + " ." + options.imageContainerClass + "[data-enable-lightbox]");
                for (i = 0; i < imagesWithDefaultLightbox.length; i++) { imagesWithDefaultLightbox[i].removeAttribute("data-enable-lightbox"); }
            }
            
            window.addEventListener("DOMContentLoaded", removeDefaultLightbox, false);
            
            function addLightbox() {
                if (event.type === "click" || (event.type === "keypress" && (event.key === "Enter" || event.which === 13))) {
                    var photo = this.querySelector("img");
                    photosetData = [];
                    
                    function addData(photo) {
                        if (!photo.getAttribute("data-highres")) {
                            var orgSrc = photo.src.slice(0, photo.src.lastIndexOf("."));
                            if (orgSrc.lastIndexOf("_") !== -1) {
                                orgSrc = orgSrc.slice(0, (orgSrc.lastIndexOf("_") + 1));
                                var imgFormat = photo.src.slice(photo.src.lastIndexOf("."));
                                highres = orgSrc + 1280 + imgFormat;
                            } else { highres = photo.src; }
                            photo.setAttribute("data-highres", highres);
                        }
                        
                        photosetData.push({ 
                            "width": photo.getAttribute("data-orig-width"),
                            "height": photo.getAttribute("data-orig-height"),
                            "low_res": photo.src,
                            "high_res": photo.getAttribute("data-highres")
                        });
                    }
                    
                    var photoIndex = this.getAttribute("data-count");
                    for (el = this; el.className.indexOf(options.generatedPhotosetContainerClass) < 0; ) { el = el.parentNode; }
                    var photos = el.querySelectorAll("." + options.imageClass);
                    for (k = 0; k < photos.length; k++) { addData(photos[k]); }
                    Tumblr.Lightbox.init(photosetData, photoIndex);
                }
            }
            
            for (i = 0; i < imageCollection.length; i++) {
                for (element = imageCollection[i]; element.className.indexOf(options.generatedPhotosetContainerClass) < 0; ) { element = element.parentNode; }
                var currentPhotosetPhotos = element.querySelectorAll("." + options.imageContainerClass);
                for (j = 0; j < currentPhotosetPhotos.length; j++) {
                    currentPhotosetPhotos[j].setAttribute("tabindex", "0");
                    currentPhotosetPhotos[j].setAttribute("data-count", (j + 1));
                    currentPhotosetPhotos[j].addEventListener("click", addLightbox, false);
                    currentPhotosetPhotos[j].addEventListener("keypress", addLightbox, false);
                }
                i += (currentPhotosetPhotos.length - 1);
            }
        }
    } else {
        console.log('[NPF PHOTOSETS] please enter a valid custom margin value or empty "photosetMargins".');
    }
}
