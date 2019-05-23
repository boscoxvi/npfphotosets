/* npfPhotosets() v2.0.0 made by codematurgy@tumblr */

function npfPhotosets(options) {
if (options.photosetMargins == "" || !isNaN(options.photosetMargins)) {
    /* general margin options */
    var defaultMargin = 1.4;
    if (options.photosetMargins == "") {
        var containerWidth = 100;
        options.photosetMargins = defaultMargin;
        var usedUnit = "%";
    } else {
        var usedUnit = "px";
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
        while ((element = element.parentNode) && element.className.indexOf(desiredClass) < 0);
        return element;
    }
    
    /* selecting possible photoset elements */
    rowsAndImages = [];
    if (options.includeSingleRowImagesInPhotosets) {
        var possibleDiv = document.querySelectorAll("." + options.rowClass + ", ." + options.imageContainerClass);
    } else {
        var possibleDiv = document.querySelectorAll("." + options.rowClass);
    }
    for (i = 0; i < possibleDiv.length; i++) {
        if (!hasClass(possibleDiv[i].parentNode, options.generatedPhotosetContainerClass) && (hasClass(possibleDiv[i], options.rowClass) || (hasClass(possibleDiv[i], options.imageContainerClass) && possibleDiv[i].getElementsByTagName("img").length > 0 && !hasClass(possibleDiv[i].parentNode, options.rowClass)))) { rowsAndImages.push(possibleDiv[i]); }
    }
    
    photosetGroups = [];
    if (rowsAndImages.length) {
        /* separating elements into respective photoset arrays */
        photosetGroups.push(new Array());
        i = 0;
        for (j = 0; i < rowsAndImages.length; ) {
            for (; i < rowsAndImages.length; i++) {
                photosetGroups[j].push(rowsAndImages[i]);
                if ((rowsAndImages[i].nextSibling === null || rowsAndImages[i].nextSibling !== rowsAndImages[i + 1]) && rowsAndImages[i + 1] !== undefined) { j++; photosetGroups.push(new Array()); }
            }
        }
        
        /* check if photoset only has full-width images and remove it  */
        if (options.includeSingleRowImagesInPhotosets) {
            for (i = photosetGroups.length - 1; i >= 0; i--) {
                var photoset = photosetGroups[i];
                if (photoset.every(arrayElementHasClass, options.imageContainerClass)) { photosetGroups.splice(i, 1); }
            }
        }
        
        /* generate photosets */
        for (i = 0; i < photosetGroups.length; i++) {
            var photosetElement = photosetGroups[i];
            for (j = 0; j < photosetElement.length; j++) {
                if (j === 0) {
                    var generatePhotosetContainer = document.createElement("div");
        generatePhotosetContainer.className = options.generatedPhotosetContainerClass;
        photosetElement[j].parentNode.insertBefore(generatePhotosetContainer, photosetElement[j]);
        generatePhotosetContainer.appendChild(photosetElement[j]);
                } else { photosetElement[j].previousSibling.appendChild(photosetElement[j]); }
            }
        }
    }
    
    /* styling */
    var photosets = document.querySelectorAll("." + options.generatedPhotosetContainerClass + ":not(." + options.generatedPhotosetContainerClass + "_processed)");
    for (i = 0; i < photosets.length; i++) {
        
        /* image container styling */
        var currentPhotosetImages = photosets[i].querySelectorAll("." + options.imageContainerClass);
        for (j = 0; j < currentPhotosetImages.length; j++) {
            var singularImage = currentPhotosetImages[j].getElementsByTagName("img")[0];
            if (!hasClass(singularImage, options.imageClass)) { singularImage.className += " " + options.imageClass; }
        }
        
        /* row-specific styling */
        var currentPhotosetRows = photosets[i].children;
        for (j = 0; j < currentPhotosetRows.length; j++) {
            
            /* style row with more than one image */
            if (currentPhotosetRows[j].className == options.rowClass) {
                /* style row images */
                var currentRowImages = currentPhotosetRows[j].querySelectorAll("." + options.imageContainerClass);
                for (k = 0; k < currentRowImages.length; k++) {
                    if (k < currentRowImages.length - 1) {
                        currentRowImages[k].style.marginRight = options.photosetMargins + usedUnit;
                    }
                    /* image container width in case of default margins */
                    if (options.photosetMargins === defaultMargin) {
                        var amountOfImages = currentPhotosetRows[j].children.length;
                        currentRowImages[k].style.width = (containerWidth - (options.photosetMargins * (amountOfImages - 1))) + usedUnit / amountOfImages;
                    }
                    /* insertion of gallery indicators */
                    if (options.insertGalleryIndicator) {
                        var generateGalleryIndicator = document.createElement("div");
                        generateGalleryIndicator.className = options.galleryIndicatorClass;
                        generateGalleryIndicator.innerHTML = options.galleryIndicatorContent;
                        currentRowImages[k].appendChild(generateGalleryIndicator);
                    }
                }
            }
            
            /* style row margin */
            if (j < currentPhotosetRows.length - 1) {
                currentPhotosetRows[j].style.marginBottom = options.photosetMargins + usedUnit;
            }
            
        }
        
        photosets[i].className += " " + options.generatedPhotosetContainerClass + "_processed";
    }
    
    /* function for row styling dependent on wrapper width */
    function styleRow() {
        var photosets = document.querySelectorAll("." + options.generatedPhotosetContainerClass);
        for (i = 0; i < photosets.length; i ++) {
            /* image container width in case of custom margins */
            if (options.photosetMargins !== defaultMargin) {
                var photosetRowImages = photosets[i].querySelectorAll("." + options.rowClass + " ." + options.imageContainerClass);
                for (j = 0; j < photosetRowImages.length; j++) {
                    var amountOfImages = photosetRowImages[j].parentNode.children.length;
                    var container = photosetRowImages[j].parentNode.getBoundingClientRect();
                    photosetRowImages[j].style.width = (container.width - (options.photosetMargins * (amountOfImages - 1))) / amountOfImages + usedUnit;
                }
            }
            
            /* image container height */
            var currentRow = photosets[i].querySelectorAll("." + options.rowClass);
            for (j = 0; j < currentRow.length; j++) {
                var currentRowImagesHeight = [];
                var currentRowImages = currentRow[j].querySelectorAll("." + options.imageClass);
                for(k = 0; k < currentRowImages.length; k++) { currentRowImagesHeight.push(currentRowImages[k].offsetHeight); }
                var rowHeight = Math.min.apply(null, currentRowImagesHeight);
                for(k = 0; k < currentRowImages.length; k++) {
                    findAncestor(currentRowImages[k], options.imageContainerClass).style.height = rowHeight + parseInt(window.getComputedStyle(findAncestor(currentRowImages[k], options.imageContainerClass)).getPropertyValue("border-top-width"), 10) + parseInt(window.getComputedStyle(findAncestor(currentRowImages[k], options.imageContainerClass)).getPropertyValue("border-bottom-width"), 10) + "px";
                    currentRowImages[k].style.marginTop = "-" + ((currentRowImages[k].offsetHeight - rowHeight) / 2) + "px";
                }
            }
        }
    }
    styleRow();
    window.addEventListener("resize", styleRow, false);
} else {
    console.log('[NPF PHOTOSETS] please enter a valid custom margin value or empty "photosetMargins".');
}
}
