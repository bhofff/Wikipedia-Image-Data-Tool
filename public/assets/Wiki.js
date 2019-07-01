$(document).ready(function() {
  // send keyword to server
  $('form').on('submit', function() {
    var imageurls = [];
    var $item = $('form input');
    var keyword = {
      item: $item.val(),
    };
    console.log('keyword is: ' + keyword.item.replace(/ /g, "_"));
    console.log(imageurls);
    // Wikipedia API URL
    var url = "https://en.wikipedia.org/w/api.php";
    $.ajax({
      type: "GET",
      url: url, //+ "?action=query&titles="+keyword.item+"&prop=imageinfo&iilimit=50&iiprop=comment|url"
      //url: "https://en.wikipedia.org/w/api.php?action=query&format=json&prop=pageimages%7Cpageterms&generator=prefixsearch&redirects=1&formatversion=2&piprop=thumbnail&pithumbsize=250&pilimit=20&wbptterms=description&gpssearch="+keyword.item+"&gpslimit=20",
      //url: "https://en.wikipedia.org/w/api.php?action=query&titles="+keyword.item+"&prop=imageinfo&iilimit=50&iiprop=url", //File:Test.jpg
      data: {
        action: "query",
        format: "json",
        prop: "images", //pageimages imageinfo images
        imlimit: "80",
        titles: keyword.item.replace(/ /g, "_"),
      },
      dataType: "jsonp",
      success: function(data) {
        //get page id
        console.log(data);
        var page = data.query.pages;
        var pageID = Object.keys(data.query.pages)[0];
        console.log('pageID: ' + pageID);
        var images = page[pageID].images;
        var imagecount = images.length;
        console.log('data length: ' + imagecount);
        if (imagecount > 0) {
          createfolder(keyword.item); //TODO: maybe get this(file name) right from wikipedia incase they are different
          console.log('length not 0');
          console.log(imageurls);
          for (var i = 0; i < imagecount; i++) {
            var imagename = images[i].title;
            // remove all the wiki logs from the list
            if (imagename.slice(0, 9) === "File:Wiki") {
              i = imagecount;
              imagecount = i - 1; // new adjusted image count
            } else {
              geturls(imagename, i);
            }
          }
          getmain(keyword.item);
        }
      },
    });

    function getmain(name) {
      $.ajax({
        type: "GET",
        url: url + '?format=json&action=query&prop=extracts&exlimit=max&explaintext&titles=' + name,
        dataType: "jsonp",
        success: function(newData3) {
          tempMain = newData3.query.pages[Object.keys(newData3.query.pages)[0]].extract.replace(/(\r\n|\n|\r)/gm,"");
          console.log('main.txt');
          console.log(tempMain);
          $.ajax({
            type: 'POST',
            url: '/wiki/' + 'main',
            gzip: true,
            data: tempMain,
            success: function(sendData3) {
              console.log(sendData3);
            }
          });
        }
      });
    }

    function geturls(name, j) {
      //TODO: step 2 get urls: action=query&titles=Image:INSERT_EXAMPLE_FILE_NAME_HERE.jpg&prop=imageinfo&iiprop=url
      /////// Images
      $.ajax({
        type: "GET",
        url: url,
        data: {
          action: "query",
          format: "json",
          prop: "imageinfo",
          titles: name,
          iiprop: "url", //comment |
        },
        dataType: "jsonp",
        success: function(newData) {
          //TODO: could be better way to do thi
          var temp;
          if (newData.query.pages.hasOwnProperty('-1') === true) {
            imageurls.push(newData.query.pages["-1"] /*.imageinfo["0"].url*/ );
            temp = newData.query.pages["-1"].imageinfo["0"].url;
          } else {
            imageurls.push(newData.query.pages[Object.keys(newData.query.pages)[0]] /*.imageinfo["0"].url*/ );
            temp = newData.query.pages[Object.keys(newData.query.pages)[0]].imageinfo["0"].url;
          }
          //Send picture URLs
          $.ajax({
            type: 'POST',
            url: '/wiki/' + 'urls',
            data: temp,
            success: function(sendData) {
            }
          });

        },
      });

      /////// Descriptions
      $.ajax({
        type: "GET",
        url: url,
        data: {
          action: "query",
          format: "json",
          prop: "imageinfo",
          titles: name,
          iiprop: "extmetadata",
        },
        dataType: "jsonp",
        success: function(newData2) {
          //TODO: could be better way to do thi
          var tempDes;
          if (newData2.query.pages.hasOwnProperty('-1') === true) {
            if (newData2.query.pages["-1"].imageinfo["0"].extmetadata.hasOwnProperty('ImageDescription') === true) {
              tempDes = newData2.query.pages["-1"].imageinfo["0"].extmetadata.ImageDescription.value;
            } else {
              console.log('Error: Image does not have description');
              tempDes = 'N/A';
              //TODO: add fuctionality to exclude image if it does not have a description.
            }
          } else {
            if (newData2.query.pages[Object.keys(newData2.query.pages)[0]].imageinfo["0"].extmetadata.hasOwnProperty('ImageDescription') === true) {
              tempDes = newData2.query.pages[Object.keys(newData2.query.pages)[0]].imageinfo["0"].extmetadata.ImageDescription.value;
            } else {
              console.log('Error: Image does not have description');
              tempDes = 'N/A';
              //TODO: add fuctionality to exclude image if it does not have a description.
            }
          }
          //Send description urls
          $.ajax({
            type: 'POST',
            url: '/wiki/' + 'descriptions',
            data: tempDes,
            success: function(sendData) {
            }
          });
        },
      });
    }

    function createfolder(name) {
      //TODO: create folder
      var foldername = name.replace(/ /g, "-");
      $.ajax({
        type: 'POST',
        url: '/wiki/' + foldername,
        data: foldername,
        success: function(folderData) {
          console.log('test 5');
        }
      });
      console.log('folder creation');
    }
    console.log('end of main');
    //TODO: save pictures
    //TODO: save descriptions
    return false;
  });
});
