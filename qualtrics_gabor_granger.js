// CUSTOM SURVEY HEADER FOR DEBUGGING ----------------------------------------------------------------------------
// hard_coded_prices: ${e://Field/prices}
// split_prices (up to 10): ${e://Field/price1}; ${e://Field/price2}; ${e://Field/price3}; ${e://Field/price4}; ${e://Field/price5}; ${e://Field/price6}; ${e://Field/price7}; ${e://Field/price8}; ${e://Field/price9}; ${e://Field/price10}
// lowest: ${e://Field/price_lowest}; highest: ${e://Field/price_highest}

// wtp: ${e://Field/wtp}
// min_rejected:  ${e://Field/min_rejected_price}
// final_wtp: ${e://Field/final_wtp}

// SET EMBEDDED DATA IN SURVEY FLOW UI ---------------------------------------------------------------------------
// prices (text)
// min_rejected_price (Number)
// wtp (Number)
// final_wtp (Number) = %{e://Field/wtp} [after loop and merge block, right before End of Survey element]

// PUT THIS ON THE INTRO PAGE JS ---------------------------------------------------------------------------------
Qualtrics.SurveyEngine.addOnload(function () {
    Qualtrics.SurveyEngine.setEmbeddedData("wtp", 0);

    var prices = "100, 200, 300, 400, 500";
    Qualtrics.SurveyEngine.setEmbeddedData("prices", prices);
    var prices = prices.split(", ").map(Number);

    Qualtrics.SurveyEngine.setEmbeddedData("price_lowest", Math.min.apply(Math, prices));
    Qualtrics.SurveyEngine.setEmbeddedData("price_highest", Math.max.apply(Math, prices));
    Qualtrics.SurveyEngine.setEmbeddedData("min_rejected_price", Math.max.apply(Math, prices)+1);

    for (i = 0; i <= prices.length; i++) {
        Qualtrics.SurveyEngine.setEmbeddedData("price" + i, prices[i - 1]);
    }
});

Qualtrics.SurveyEngine.addOnReady(function () {
    /*Place your JavaScript here to run when the page is fully displayed*/

});

Qualtrics.SurveyEngine.addOnUnload(function () {
    /*Place your JavaScript here to run when the page is unloaded*/

});

// LOOP AND MERGE BLOCK --------------------------------------------------------------------------------------
// Single Yes/No multiple choice question in its own block
// In UI, set block as Loop and Merge with number of fields mapped to price level embedded data naming convention created in JS above 
// Add display logic on this loop and merge question such that :
// - If min_rejected_price Is Greater Than ${lm://Field/1}
// - And wtp is Less Than ${lm://Field1}
// - i.e., show new prices only if under the rejection threshold and if haven't already agreed to a higher number

Qualtrics.SurveyEngine.addOnPageSubmit(function () {
    // if the first radio button (assuming it is Yes) is checked when page submitted, log the shown price as the new WTP
    if (document.querySelector(".LabelWrapper > label").hasClassName("q-checked")) {
        Qualtrics.SurveyEngine.setEmbeddedData("wtp", "${lm://Field/1}");
    } else {
        // if current price being rejected is higher than past rejected ones, update max rejected price 
        if ("${lm://Field/1}" < "${e://Field/min_rejected_price}") {
            Qualtrics.SurveyEngine.setEmbeddedData("min_rejected_price", "${lm://Field/1}");
        }
    }
});
