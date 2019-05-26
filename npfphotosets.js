/* npfPhotosets() v2.0.0 made by codematurgy@tumblr */
            
var rowFunctionAttached = false;

function npfPhotosets(selector, options) {
    if (typeof selector === "string") { var postCollection = document.querySelectorAll(selector); } else { var postCollection = selector; }
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
    
        /* selecting possible photoset elements */
        for(i = 0; i < postCollection.length; i++) {
            rowsAndImages = [];
            if (options.includeSingleRowImagesInPhotosets) { var possibleDiv = postCollection[i].querySelectorAll("." + options.rowClass + ", ." + options.imageContainerClass); } else { var possibleDiv = postCollection[i].querySelectorAll("." + options.rowClass); }
        
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
        
                /* check if photoset only has full-width images and remove it  */
                if (options.includeSingleRowImagesInPhotosets) {
                    for (j = photosetGroups.length - j; j >= 0; j--) {
                        var photoset = photosetGroups[j];
                        if (photoset.every(arrayElementHasClass, options.imageContainerClass)) { photosetGroups.splice(j, 1); }
                    }
                }
        
                /* generate photosets */
                for (j = 0; j < photosetGroups.length; j++) {
                    var photosetElement = photosetGroups[j];
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
                        var rowWidthMinusMargins;
                        for (l = 0; l < currentRowImageContainers.length; l++) { rowWidthMinusMargins += currentRowImageContainers.clientWidth; }
                        for (l = 0; l < currentRowImageContainers.length; l++) { currentRowImageContainers[l].style.width = (rowWidthMinusMargins / currentRowImageContainers.length) + "px"; }
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
        styleRow();
    
        if (rowFunctionAttached === false) { window.addEventListener("resize", styleRow, false); } rowFunctionAttached = true;
    } else {
        console.log('[NPF PHOTOSETS] please enter a valid custom margin value or empty "photosetMargins".');
    }
}
