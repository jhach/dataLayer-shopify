<script>
/*
===================================
| DATALAYER ARCHITECTURE: SHOPIFY + BIZRATE INSIGHTS |
-----------------------------------

DEFINITION:
A data layer helps you collect more accurate analytics data, that in turn allows you to better understand what potential buyers are doing on your website and where you can make improvements. It also reduces the time to implement marketing tags on a website, and reduces the need for IT involvement, leaving them to get on with implementing new features and fixing bugs.

RESOURCES:
http://www.datalayerdoctor.com/a-gentle-introduction-to-the-data-layer-for-digital-marketers/
http://www.simoahava.com/analytics/data-layer/

AUTHOR:
James Hach = [{
Email: jameshach@gmail.com,
Website: jameshach.com,
Bizrate Insights: [{
  Email: jhach@bizrate.com,
  Position: Product Manager
}]
}];

EXTERNAL DEPENDENCIES:
* jQuery
* jQuery Cookie Plugin v1.4.1 - https://github.com/carhartl/jquery-cookie
* cartjs - https://github.com/discolabs/cartjs

MAD PROPS (Original Authors):
AUTHORS:
Mechelle Warneke = [{
Email: mechellewarneke@gmail.com,
Website: mechellewarneke.com,
BVACCEL: [{
  Email: mechelle@bvaccel.com,
  Position: XO Strategist | Technical Web Analyst
}]
}];
Tyler Shambora = [{
Website: tylershambora.com,
BVACCEL: [{
  Email: tyler@bvaccel.com,
  Position: Lead Web Developer
}]
}];

FORKED (Please Visit):
https://github.com/TechnicalWebAnalytics/dataLayer-shopify

DataLayer Architecture: Shopify v1.3.1
COPYRIGHT 2016
LICENSES: MIT ( https://opensource.org/licenses/MIT )
*/

/* PRELOADS */
// load jquery if it doesn't exist
if(!window.jQuery){var jqueryScript=document.createElement('script');jqueryScript.setAttribute('src','https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js');document.head.appendChild(jqueryScript);}

__bri__jQueryinterval = setInterval(function(){
// --------------------------------------------- wait for jQuery to load
if(window.jQuery){
// --------------- run script after jQuery has loaded

// search parameters
getURLParams = function(name, url){
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
  };

/* =====================
| DYNAMIC DEPENDENCIES |
--------------------- */

__bri__ = {
  dynamicCart: true,  // if cart is dynamic (meaning no refresh on cart add) set to true
  debug: true, // if true, console messages will be displayed
  cart: null,
  wishlist: null,
  removeCart: null
};

customBindings = {
  cartTriggers: [],
  viewCart: [],
};

/* DO NOT EDIT */
defaultBindings = {
  cartTriggers: ['form[action="/cart/add"] [type="submit"],.add-to-cart,.cart-btn'],
  viewCart: ['form[action="/cart"],.my-cart,.trigger-cart,#mobileCart'],
};

// stitch bindings
objectArray = customBindings;
outputObject = __bri__;

applyBindings = function(objectArray, outputObject){
  for (var x in objectArray) {
    var key = x;
    var objs = objectArray[x];
    values = [];
    if(objs.length > 0){
      values.push(objs);
      if(key in outputObject){
        values.push(outputObject[key]);
        outputObject[key] = values.join(", ");
      }else{
        outputObject[key] = values.join(", ");
      }
    }
  }
};

applyBindings(customBindings, __bri__);
applyBindings(defaultBindings, __bri__);

/* =======================
| PREREQUISITE LIBRARIES |
----------------------- */

  clearInterval(__bri__jQueryinterval);

    // jquery-cookies.js
    if(typeof $.cookie!==undefined){(function(a){if(typeof define==='function'&&define.amd){define(['jquery'],a)}else if(typeof exports==='object'){module.exports=a(require('jquery'))}else{a(jQuery)}}(function($){var g=/\+/g;function encode(s){return h.raw?s:encodeURIComponent(s)}function decode(s){return h.raw?s:decodeURIComponent(s)}function stringifyCookieValue(a){return encode(h.json?JSON.stringify(a):String(a))}function parseCookieValue(s){if(s.indexOf('"')===0){s=s.slice(1,-1).replace(/\\"/g,'"').replace(/\\\\/g,'\\')}try{s=decodeURIComponent(s.replace(g,' '));return h.json?JSON.parse(s):s}catch(e){}}function read(s,a){var b=h.raw?s:parseCookieValue(s);return $.isFunction(a)?a(b):b}var h=$.cookie=function(a,b,c){if(arguments.length>1&&!$.isFunction(b)){c=$.extend({},h.defaults,c);if(typeof c.expires==='number'){var d=c.expires,t=c.expires=new Date();t.setMilliseconds(t.getMilliseconds()+d*864e+5)}return(document.cookie=[encode(a),'=',stringifyCookieValue(b),c.expires?'; expires='+c.expires.toUTCString():'',c.path?'; path='+c.path:'',c.domain?'; domain='+c.domain:'',c.secure?'; secure':''].join(''))}var e=a?undefined:{},cookies=document.cookie?document.cookie.split('; '):[],i=0,l=cookies.length;for(;i<l;i++){var f=cookies[i].split('='),name=decode(f.shift()),cookie=f.join('=');if(a===name){e=read(cookie,b);break}if(!a&&(cookie=read(cookie))!==undefined){e[name]=cookie}}return e};h.defaults={};$.removeCookie=function(a,b){$.cookie(a,'',$.extend({},b,{expires:-1}));return!$.cookie(a)}}))}

    /* ======================
    | Begin dataLayer Build |
    ---------------------- */

    // if debug
    if(__bri__.debug){
      console.log('=====================\n| BIZRATE INSIGHTS DATALAYER FOR SHOPIFY |\n---------------------');
      console.log('Page Template: {{ template }}');
    }

    window.dataLayer = window.dataLayer || [];  // init data layer if doesn't already exist
    dataLayer.push({'event': 'Begin DataLayer'}); // begin datalayer

    var template = "{{template}}";

    /* Landing Page Cookie
    -----------------------
    1. Detect if user just landed on the site
    2. Only fires if Page Title matches website */

    $.cookie.raw = true;
    if ($.cookie('landingPage') === undefined || $.cookie('landingPage').length === 0) {
      var landingPage = true;
      $.cookie('landingPage', unescape);
      $.removeCookie('landingPage', {path: '/'});
      $.cookie('landingPage', 'landed', {path: '/'});
    } else {
      var landingPage = false;
      $.cookie('landingPage', unescape);
      $.removeCookie('landingPage', {path: '/'});
      $.cookie('landingPage', 'refresh', {path: '/'});
    }
    if (__bri__.debug) {
      console.log('Landing Page: ' + landingPage);
    }

    /* Log State Cookie
    ------------------- */
    {% if customer %}
    var isLoggedIn = true;
    {% else %}
    var isLoggedIn = false;
    {% endif %}
    if (!isLoggedIn) {
      $.cookie('logState', unescape);
      $.removeCookie('logState', {path: '/'});
      $.cookie('logState', 'loggedOut', {path: '/'});
    } else {
      if ($.cookie('logState') === 'loggedOut' || $.cookie('logState') === undefined) {
        $.cookie('logState', unescape);
        $.removeCookie('logState', {path: '/'});
        $.cookie('logState', 'firstLog', {path: '/'});
      } else if ($.cookie('logState') === 'firstLog') {
        $.cookie('logState', unescape);
        $.removeCookie('logState', {path: '/'});
        $.cookie('logState', 'refresh', {path: '/'});
      }
    }

    if ($.cookie('logState') === 'firstLog') {
      var firstLog = true;
    } else {
      var firstLog = false;
    }

    /* ==========
    | DATALAYERS |
    ----------- */

    /* DATALAYER: Landing Page
    --------------------------
    Fires any time a user first lands on the site. */

    if ($.cookie('landingPage') === 'landed') {
      dataLayer.push({
        'pageType': 'Landing',
        'event': 'Landing'
      });

      if (__bri__.debug) {
        console.log('DATALAYER: Landing Page fired.');
      }
    }

    /*DATALAYER: Homepage
    --------------------------- */

    if(document.location.pathname == "/"){
      var homepage = {
        'pageType' : 'Homepage',
        'event'    : 'Homepage'
      };
      dataLayer.push(homepage);
      if(__bri__.debug){
        console.log("Homepage"+" :"+JSON.stringify(homepage, null, " "));
      }
    }

    /* DATALAYER: Product List Page (Collections, Category)
    -------------------------------------------------------
    Fire on all product listing pages. */

    {% if template contains 'collection' %}
    var product = {
      'products': [
      {% for product in collection.products %}{
        'id'              : '{{ product.id }}',
        'sku'             : '{{product.selected_variant.sku}}',
        'productType'     : "{{product.type}}",
        'title'            : "{{product.title}}",
        'price'           : '{{product.price | money_without_currency | remove: ","}}',
        'imageURL'        : "https:{{product.featured_image.src|img_url:'grande'}}",
        'productURL'      : '{{shop.secure_url}}{{product.url}}',
        'brand'           : '{{shop.name}}',
        'originalPrice'    : '{{product.compare_at_price_max|money_without_currency}}',
        'categories'      : {{product.collections|map:"title"|json}},
        'currentCategory' : "{{collection.title}}",
        'productOptions'  : {
          {% for option in product.options_with_values %}
          {% for value in option.values %}
          {% if option.selected_value == value %}
          "{{option.name}}" : "{{value}}",
          {% endif %}
          {% endfor %}
          {% endfor %}
        }
      },
      {% endfor %}]
    };
    var collections = {
      'productList' : "{{collection.title}}",
      'pageType'    : 'Collection',
      'event'       : 'Collection'
    };
    dataLayer.push(product);
    dataLayer.push(collections);
    if(__bri__.debug){
      console.log("Collections"+" :"+JSON.stringify(product, null, " "));
      console.log("Collections"+" :"+JSON.stringify(collections, null, " "));
    }
    {% endif %}

    /* DATALAYER: Product Page
    --------------------------
    Fire on all Product View pages. */

    if (template.match(/.*product.*/gi) && !template.match(/.*collection.*/gi)) {

      sku = '';
      var product = {
        'products': [{
          'id'              : '{{product.id}}',
          'sku'             : '{{product.selected_variant.sku}}',
          'productType'     : "{{product.type}}",
          'title'            : '{{product.title}}',
          'price'           : '{{product.price | money_without_currency | remove: ","}}',
          'description'     : '{{product.description | strip_newlines | strip_html | escape }}',
          'imageURL'        : "https:{{product.featured_image.src|img_url:'grande'}}",
          'productURL'      : '{{shop.secure_url}}{{product.url}}',
          'brand'           : '{{shop.name}}',
          'originalPrice'    : '{{product.compare_at_price_max|money_without_currency}}',
          'categories'      : {{product.collections|map:"title"|json}},
          'currentCategory' : "{{collection.title}}",
          'productOptions'  : {
            {% for option in product.options_with_values %}
            {% for value in option.values %}
            {% if option.selected_value == value %}
            "{{option.name}}" : "{{value}}",
            {% endif %}
            {% endfor %}
            {% endfor %}
          }
        }]
      };

      function productView(){
        var sku = '{{product.selected_variant.sku}}';
        dataLayer.push(product, {
          'pageType' : 'Product',
          'event'    : 'Product'});
        if(__bri__.debug){
          console.log("Product"+" :"+JSON.stringify(product, null, " "));
        }
      }
      productView();

      $(__bri__.cartTriggers).click(function(){
        var skumatch = '{{product.selected_variant.sku}}';
        if(sku != skumatch){
          productView();
        }
      });
    }

    /* DATALAYER: Cart View
    -----------------------
    1. Fire anytime a user views their cart (non-dynamic) */

    {% if template contains 'cart' %}
    var cart = {
      'products':[{% for line_item in cart.items %}{
        'id'       : '{{line_item.product_id}}',
        'sku'      : '{{line_item.sku}}',
        'title'     : '{{line_item.title}}',
        'price'    : '{{line_item.price | money_without_currency}}',
        'quantity' : '{{line_item.quantity}}'
      },{% endfor %}],
      'pageType' : 'Cart',
      'event'    : 'Cart'
    };

    dataLayer.push(cart);
    if(__bri__.debug){
      console.log("Cart"+" :"+JSON.stringify(cart, null, " "));
    }

    __bri__.cart = cart.products;
    $(__bri__.removeCartTrigger).on('click', function (event) {

    setTimeout(function(){
    // ------------------------------------------------------------------- remove from cart

      jQuery.getJSON("/cart", function (response) {
      // --------------------------------------------- get Json response

        __bri__.removeCart = response;
        var removeFromCart = {
          'products': __bri__.removeCart.items.map(function (line_item) {
            return {
              'id'       : line_item.product_id,
              'sku'      : line_item.sku,
              'title'     : line_item.title,
              'price'    : (line_item.price/100),
              'quantity' : line_item.quantity
            }
          }),
          'pageType' : 'Remove from Cart',
          'event'    : 'Remove from Cart'
        };
        __bri__.removeCart = removeFromCart;
        var cartIDs = [];
        var removeIDs = [];
        var removeCart = [];

        // remove from cart logic
        for(var i=__bri__.cart.length-1;i>=0;i--){var x=parseFloat(__bri__.cart[i].variant);cartIDs.push(x)}for(var i=__bri__.removeCart.products.length-1;i>=0;i--){var x=parseFloat(__bri__.removeCart.products[i].variant);removeIDs.push(x)}function arr_diff(b,c){var a=[],diff=[];for(var i=0;i<b.length;i++){a[b[i]]=true}for(var i=0;i<c.length;i++){if(a[c[i]]){delete a[c[i]]}else{a[c[i]]=true}}for(var k in a){diff.push(k)}return diff};var x=arr_diff(cartIDs,removeIDs)[0];for(var i=__bri__.cart.length-1;i>=0;i--){if(__bri__.cart[i].variant==x){removeCart.push(__bri__.cart[i])}}

        dataLayer.push(removeCart);
        if (__bri__.debug) {
          console.log("Cart"+" :"+JSON.stringify(removeCart, null, " "));
        }

      // --------------------------------------------- get Json response
      });

    // ------------------------------------------------------------------- remove from cart
    }, 2000);

    });

    {% endif %}

    /* DATALAYER Variable: Checkout & Transaction Data */

    __bri__products = [];

    {% for line_item in checkout.line_items %}

    __bri__products.push({
      'id'          : '{{line_item.product_id}}',
      'sku'         : '{{line_item.sku}}',
      'title'        : '{{line_item.title}}',
      'productType' : "{{line_item.product.type}}",
      'price'       : '{{line_item.price | money_without_currency| remove: ","}}',
      'quantity'    : '{{line_item.quantity}}',
      'description' : '{{line_item.product.description | strip_newlines | strip_html | escape }}',
      'imageURL'    : "https:{{line_item.product.featured_image.src|img_url:'grande'}}",
      'productURL'  : '{{shop.secure_url}}{{line_item.product.url}}'
    });

    {% endfor %}
    transactionData = {
      'orderId'      : '{{checkout.order_id}}',
      'transactionTotal'       : '{{checkout.total_price |  money_without_currency| remove: ","}}',
      'transactionTax'         : '{{checkout.tax_price |  money_without_currency| remove: ","}}',
      'transactionShipping'    : '{{checkout.shipping_price |  money_without_currency| remove: ","}}',
      'transactionSubtotal'    : '{{checkout.subtotal_price |  money_without_currency| remove: ","}}',
      {% for discount in checkout.discounts %}
      'promoCode' : '{{discount.code}}',
      'discount'  : '{{discount.amoun t | money_without_currency}}',
      {% endfor %}

      'products': __bri__products
    };

    if(__bri__.debug == true){
      /* DATALAYER: Transaction
      -------------------------- */
      if(document.location.pathname.match(/.*order.*/g)){
        dataLayer.push(transactionData,{
          'pageType' :'Transaction',
          'event'    :'Transaction'
        });
        console.log("Transaction Data"+" :"+JSON.stringify(transactionData, null, " "));
      }
    }

    /* DATALAYER: Checkout
    -------------------------- */
    if(Shopify.Checkout){
      if(Shopify.Checkout.step){
        if(Shopify.Checkout.step.length > 0){
          if (Shopify.Checkout.step === 'contact_information'){
            dataLayer.push(transactionData,{
              'event'    :'Customer Information',
              'pageType' :'Customer Information'});
              console.log("Customer Information - Transaction Data"+" :"+JSON.stringify(transactionData, null, " "));
          }else if (Shopify.Checkout.step === 'shipping_method'){
            dataLayer.push(transactionData,{
              'event'    :'Shipping Information',
              'pageType' :'Shipping Information'});
              console.log("Shipping - Transaction Data"+" :"+JSON.stringify(transactionData, null, " "));
          }else if( Shopify.Checkout.step === "payment_method" ){
            dataLayer.push(transactionData,{
              'event'    :'Add Payment Info',
              'pageType' :'Add Payment Info'});
              console.log("Payment - Transaction Data"+" :"+JSON.stringify(transactionData, null, " "));
          }
        }

        if(__bri__.debug == true){
          /* DATALAYER: Transaction
          -------------------------- */
            if(Shopify.Checkout.page == "thank_you"){
              dataLayer.push(transactionData,{
                'pageType' :'Transaction',
                'event'    :'Transaction'
              });
              console.log("Transaction Data"+" :"+JSON.stringify(transactionData, null, " "));
            }
        }else{
          /* DATALAYER: Transaction
          -------------------------- */
          if(Shopify.Checkout.page == "thank_you"){
            dataLayer.push(transactionData,{
              'pageType' :'Transaction',
              'event'    :'Transaction'
            });
          }
        }
      }
    }

    /* DATALAYER: All Pages
    -----------------------
    Fire all pages trigger after all additional dataLayers have loaded. */

    dataLayer.push({
      'event': 'DataLayer Loaded'
    });

    console.log('DATALAYER: DataLayer Loaded.');

    /*==========================
    | dataLayer Event Bindings |
    --------------------------*/

    /* DATALAYER: Add to Cart / Dynamic Cart View
    ---------------------------------------------
    Fire all pages trigger after all additional dataLayers have loaded. */

    $(document).ready(function() {

      /* DATALAYER: Search Results
      --------------------------- */

      var searchPage = new RegExp(__bri__.searchPage, "g");
      if(document.location.pathname.match(searchPage)){
        var search = {
          'searchTerm' : __bri__.searchTermQuery,
          'pageType'   : "Search",
          'event'      : "Search"
        };

        dataLayer.push(search);
        if(__bri__.debug){
          console.log("Search"+" :"+JSON.stringify(search, null, " "));
        }
      }

      /* DATALAYER: Cart
      ------------------- */

      /* STAGE CART DATA */
      function mapJSONcartData(){
        jQuery.getJSON('/cart.js', function (response) {
        // --------------------------------------------- get Json response
          __bri__.cart = response;
          var cart = {
            'products': __bri__.cart.items.map(function (line_item) {
              return {
                'id'       : line_item.id,
                'sku'      : line_item.sku,
                'title'     : line_item.title,
                'price'    : (line_item.price/100),
                'quantity' : line_item.quantity
              }
              }),
            'pageType' : 'Cart',
            'event'    : 'Cart'
          };
          if(cart.products.length > 0){
            dataLayer.push(cart);
            if (__bri__.debug) {
              console.log("Cart"+" :"+JSON.stringify(cart, null, " "));
            }
          }
        // --------------------------------------------- get Json response
        });
      }

      viewcartfire = 0;

      /* VIEW CART */
      $(__bri__.viewCart).on('click', function (event) {
      // ------------------------------------------------------------------------- view cart

        if(viewcartfire !== 1){

        viewcartfire = 1;
        // IF DYNAMIC CART IS TRUE
        if (__bri__.dynamicCart) {
        // ---------------------------------- if dynamic cart is true
        cartCheck = setInterval(function () {
        // -------------------------------------- begin check interval
          if ($(__bri__.cartVisableSelector).length > 0) {
          // ------------------------------------------------------------------ check visible selectors
            clearInterval(cartCheck);
            mapJSONcartData();
            // ------------------------------------------------------------------ check visible selectors
            $(__bri__.removeCartTrigger).on('click', function (event) {
            // ------------------------------------------------------------------- remove from cart
              var link = $(this).attr("href");
              jQuery.getJSON(link, function (response) {
              // --------------------------------------------- get Json response
                __bri__.removeCart = response;
                var removeFromCart = {
                  'products': __bri__.removeCart.items.map(function (line_item) {
                    return {
                      'id'       : line_item.id,
                      'sku'      : line_item.sku,
                      'title'     : line_item.title,
                      'price'    : (line_item.price/100),
                      'quantity' : line_item.quantity
                    }
                  }),
                    'pageType' : 'Remove from Cart',
                    'event'    : 'Remove from Cart'
                  };
                dataLayer.push(removeFromCart);
                if (__bri__.debug) {
                  console.log("Cart"+" :"+JSON.stringify(removeFromCart, null, " "));
                }
              // --------------------------------------------- get Json response
              });
            // ------------------------------------------------------------------- remove from cart
            });
            }
          // -------------------------------------- begin check interval
          }, 500);
        // ---------------------------------- if dynamic cart is true
        }
      }
      // ------------------------------------------------------------------------- view cart
      });

      /* ADD TO CART */
      jQuery.getJSON('/cart.js', function (response) {
      // --------------------------------------------- get Json response
        __bri__.cart = response;
        var cart = {
          'products': __bri__.cart.items.map(function (line_item) {
            return {
              'id'       : line_item.id,
              'sku'      : line_item.sku,
              'title'     : line_item.title,
              'price'    : (line_item.price/100),
              'quantity' : line_item.quantity
            }
          })
        }
      // --------------------------------------------- get Json response
      __bri__.cart = cart;
      collection_cartIDs = [];
      collection_matchIDs = [];
      collection_addtocart = [];
      for (var i = __bri__.cart.products.length - 1; i >= 0; i--) {
          var x = parseFloat(__bri__.cart.products[i].variant);
          collection_cartIDs.push(x);
      }
      });

      function __bri__addtocart(){
        {% if template contains 'collection' %}

        setTimeout(function(){
          jQuery.getJSON('/cart.js', function (response) {
            // --------------------------------------------- get Json response
            __bri__.cart = response;
            var cart = {
              'products': __bri__.cart.items.map(function (line_item) {
                return {
                  'id'       : line_item.id,
                  'sku'      : line_item.sku,
                  'title'     : line_item.title,
                  'price'    : (line_item.price/100),
                  'quantity' : line_item.quantity
                }
              })
            }
            __bri__.cart = cart;
            for (var i = __bri__.cart.products.length - 1; i >= 0; i--) {
              var x = parseFloat(__bri__.cart.products[i].variant);
              collection_matchIDs.push(x);
            }
            function arr_diff(b, c) {
              var a = [],
              diff = [];
              for (var i = 0; i < b.length; i++) {
                a[b[i]] = true
              }
              for (var i = 0; i < c.length; i++) {
                if (a[c[i]]) {
                  delete a[c[i]]
                } else {
                  a[c[i]] = true
                }
              }
              for (var k in a) {
                diff.push(k)
              }
              return diff
            };
            var x = arr_diff(collection_cartIDs, collection_matchIDs).pop();
            console.log(x);
            for (var i = __bri__.cart.products.length - 1; i >= 0; i--) {
              if (__bri__.cart.products[i].variant.toString() === x) {
                product = {'products':[__bri__.cart.products[i]]};
                dataLayer.push({'products':product});
                dataLayer.push(product);
                dataLayer.push({
                  'pageType' : 'Add to Cart',
                  'event'    : 'Add to Cart'
                });
                if (__bri__.debug) {
                  console.log("Add to Cart"+" :"+JSON.stringify(product, null, " "));
                }
              }
            }
            // --------------------------------------------- get Json response
          });
        },1000);

        {% else %}

        dataLayer.push(product, {
          'pageType' : 'Add to Cart',
          'event'    : 'Add to Cart'
        });

        if (__bri__.debug) {
          console.log("Add to Cart"+" :"+JSON.stringify(product, null, " "));
        }

        {% endif %}

          // IF DYNAMIC CART IS TRUE
          if (__bri__.dynamicCart) {
            console.log("dynamic");
            // ---------------------------------- if dynamic cart is true
            var cartCheck = setInterval(function () {
            // -------------------------------------- begin check interval
            if ($(__bri__.cartVisableSelector).length > 0) {
              // ------------------------------------------------------------------ check visible selectors
              clearInterval(cartCheck);
              mapJSONcartData();
              // ------------------------------------------------------------------ check visible selectors
              $(__bri__.removeCartTrigger).on('click', function (event) {
              // ------------------------------------------------------------------- remove from cart
              var link = $(this).attr("href");
              jQuery.getJSON(link, function (response) {
                // --------------------------------------------- get Json response
                __bri__.removeCart = response;
                var removeFromCart = {
                  'products': __bri__.removeCart.items.map(function (line_item) {
                    return {
                      'id'       : line_item.id,
                      'sku'      : line_item.sku,
                      'title'     : line_item.title,
                      'price'    : (line_item.price/100),
                      'quantity' : line_item.quantity
                    }
                  }),
                  'pageType' : 'Remove from Cart',
                  'event'    : 'Remove from Cart'
                };
                dataLayer.push(removeFromCart);
                if (__bri__.debug) {
                  console.log("Cart"+" :"+JSON.stringify(removeFromCart, null, " "));
                }
                // --------------------------------------------- get Json response
              });
              // ------------------------------------------------------------------- remove from cart
            });
            }
            // -------------------------------------- begin check interval
          }, 500);
          // ---------------------------------- if dynamic cart is true
        }
      }

      $(document).on('click', __bri__.cartTriggers, function() {
        __bri__addtocart();
      });

    }); // document ready

  // --------------- run script after jQuery has loaded
  }
// --------------------------------------------- wait for jQuery to load
}, 500);
</script>
