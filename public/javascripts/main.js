/**
 * Created by apple on 6/29/17.
 */
"use strict";
$(function() {
    $("#sign-in-with-twitter").on("click", function() {
        window.location.href = "/user/request-token";
    });
});