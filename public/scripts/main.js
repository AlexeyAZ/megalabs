"use strict";

$(function () {

    var $body = $("body");
    var $header = $(".header");
    var $footer = $(".footer");
    var $subSidebar = $(".sidebar_sub");
    var $headerNavHeight = $header.height();

    // валидация полей формы
    $.validate({
        scrollToTopOnError: true,
        borderColorOnError: '#d0011b'
    });

    // валидация номера телефона
    $(".input[type='phone']").mask("?(999) 999-9999");

    $(".input[name=name]").attr("data-validation", "required");
    $(".input[name=message]").attr("data-validation", "required");
    $(".input[name=email]").attr("data-validation", "required email");
    $(".input[name=phone]").attr("data-validation", "required length").attr("data-validation-length", "14");
    $(".input[name=letter]").attr("data-validation", "required");

    // about-us появление картинки
    $(".about-us__img-container").viewportChecker({
        classToAdd: 'about-us__img-container_visible'
    });

    // цвета точек в зависимости от прокрутки
    function dotColor() {
        if ($(".fixed-block").length) {
            var screenHeight = $(window).height();
            var scrollHeight = $(window).scrollTop();

            if (scrollHeight < screenHeight) {
                //$(".decor-lines").addClass("decor-lines_dot-white");
            } else {
                    //$(".decor-lines").removeClass("decor-lines_dot-white");
                }
        }
    }

    dotColor();

    $(window).on("scroll", function () {
        dotColor();
    });

    // отправка данных формы
    $(document).ready(function () {
        var $form = $("form");

        if (!$form.length) {
            return false;
        }

        $form.submit(formHandler);

        function formHandler(event) {

            var $form = $("form");

            var name = $form.find("input[name=name]");
            var email = $form.find("input[name=email]");
            var phone = $form.find("input[name=phone]");
            var hhLink = $form.find("input[name=hh-link]");
            var letter = $form.find("textarea");
            var approve = $form.find("input[name=approve]");

            if ($form.find("input[type=file]").length) {
                var file = $("#file")[0].files[0];
            } else {
                var file = "";
            }

            if (!approve.is(":checked") && approve.length) {
                console.log("чекбокс!");
                event.preventDefault();
                return false;
            }

            var outputData = {
                "name": name.val(),
                "email": email.val(),
                "phone": phone.val(),
                "hhLink": hhLink.val(),
                "letter": letter.val(),
                "file": file
            };
            var json_data = JSON.stringify(outputData);

            $.get(submitURL, json_data, function (data) {
                var answer = data.status;
                console.log(answer);
                if (answer == "true" && $form.closest(".contacts__feedback-container")) {
                    $(".contacts__feedback-container").hide();
                    $(".contacts__send").show();
                } else if (answer == "true") {
                    console.log(outputData);
                } else {
                    console.log("данные не отправлены");
                }
            }).fail(function () {
                console.log("фейл отправки");
            });

            event.preventDefault();
            return false;
        }
    });

    // активный элемент в сайдбаре
    function setActiveSidebarItem() {
        var path = $(location).attr("pathname").slice(1, -5);

        $subSidebar.find(".sidebar__item").each(function () {
            var $this = $(this);

            if ($this.attr("href").slice(0, -5) == path) {
                $this.addClass("sidebar__item_active");
            }
        });
    }
    setActiveSidebarItem();

    // активный элемент в шапке
    function setActiveHeaderItem() {
        var $path = $(location).attr("pathname").slice(1, -5);

        $header.find(".header__nav-link").each(function () {
            var $this = $(this);
            var $inlinePath = $this.attr("href").slice(0, -5);

            console.log($inlinePath);

            if ($this.hasClass("header__nav-link_directions") && ($path == "mobile_ads" || $path == "communications" || $path == "video" || $path == "finance" || $path == "internet_things")) {
                $this.addClass("header__nav-link_active");
            } else if ($inlinePath == $path && !$this.hasClass("header__nav-link_logo") && $inlinePath != "main") {
                $this.addClass("header__nav-link_active");
            }
        });
    }
    setActiveHeaderItem();

    // Видео на главной странице
    var mainVideo = $(".main__video")[0];

    function playVid() {
        mainVideo.play();
    }
    function pauseVid() {
        mainVideo.pause();
    }

    // исправляет баг с лого в firefox
    $('.main__block-content').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
        var $this = $(this);

        $this.removeClass("animated");
    });

    // плавное перемещение к якорям
    $body.on("click", ".js-anchor-link", function (e) {
        e.preventDefault();

        var $this = $(this);
        var $id = $this.attr("href");
        var $scrollTarget = $($id);

        $("html, body").animate({
            scrollTop: $scrollTarget.offset().top - $headerNavHeight
        }, 300);

        location.hash = $id;
    });

    // ширина полосы прокрутки
    function scrollbarWidth() {
        var documentHeight = parseInt(document.documentElement.clientHeight);
        var windowsHeight = parseInt(window.innerHeight);
        var scrollbarWidth = windowsHeight - documentHeight;
        return scrollbarWidth;
    }

    // зафиксировать сайдбар
    function sidebarPos() {
        var $scrollHeight = $(window).scrollTop();
        var $windowHeight = $(window).height();
        var $contentHeight = $body.height() - $footer.outerHeight() + scrollbarWidth();

        if ($scrollHeight < $subSidebar.height()) {
            $subSidebar.css({
                top: $windowHeight - $scrollHeight + scrollbarWidth(),
                bottom: $windowHeight + $subSidebar.height() + scrollbarWidth() - $scrollHeight
            });
        } else if ($scrollHeight >= $subSidebar.height() && $scrollHeight < $contentHeight) {
            $subSidebar.css({
                top: $header.height(),
                bottom: 0
            });
        } else if ($scrollHeight >= $contentHeight) {
            $subSidebar.css({
                top: -($scrollHeight - $contentHeight - $header.height()),
                bottom: $scrollHeight - $contentHeight + $header.height()
            });
        }
    }

    $(window).on("scroll", function () {
        sidebarPos();
    });

    sidebarPos();

    // добавить шапке прозрачность при прокрутке
    $(window).on("scroll", function () {
        var $scrollHeight = $(window).scrollTop();

        if (!$header.hasClass("main__header")) {
            if ($scrollHeight > 0) {
                $header.addClass("header_opacity");
            } else {
                $header.removeClass("header_opacity");
            }
        }
    });

    // эффект параллакс
    $('.main__block').each(function () {
        var $this = $(this);
        var $bg = $this.data('bg');

        $this.parallax({
            imageSrc: $bg
        });
    });

    // Рандомная позиция для анимации точек
    function decorLinesTop(min, max) {
        var rand = min - 0.5 + Math.random() * (max - min + 1);
        rand = Math.round(rand);
        return rand;
    }

    $(".decor-lines__point").each(function () {
        var $this = $(this);

        setInterval(function () {
            $this.css({
                top: decorLinesTop(1, 100) + "%"
            });
        }, 2000);
    });

    $(".header__nav-link").css("opacity", "1");

    // переход на детальную страницу направления
    $body.on("click", ".main__block-link", function (e) {

        e.preventDefault();

        var $this = $(this);
        var $link = $this.attr("href");

        $this.closest(".main__block-content").addClass("main__block-content_hide");

        //$(".header__nav-link_directions").addClass("header__nav-link_active");

        //$header.addClass("header_opacity").removeClass("header_color_white main__header_logo_hide");
        //$(".main__about-logo-container").remove();
        $(".main__sidebar ").addClass("main__sidebar_hide");

        setTimeout(function () {
            location.href = $link;
        }, 300);
    });

    if ($header.hasClass("header_load")) {
        $header.removeClass("header_no-bg header_color_white");
    }

    $(".fixed-block__container").addClass("fixed-block__container_visible");

    // главная страница
    if ($("#fullpage").length) {
        $("#fullpage").fullpage({
            //Navigation
            //menu: '#menu',
            lockAnchors: false,
            anchors: ['about_page', 'mobileads_page', 'communication_page', 'video_page', 'finance_page', 'internet_things_page', 'content_page'],
            navigation: false,
            navigationPosition: 'right',
            //navigationTooltips: ['firstSlide', 'secondSlide'],
            showActiveTooltip: false,
            slidesNavigation: false,
            slidesNavPosition: 'bottom',

            //Scrolling
            css3: true,
            scrollingSpeed: 600,
            autoScrolling: true,
            fitToSection: false,
            fitToSectionDelay: 1000,
            scrollBar: true,
            //easing: 'easeOut',
            easingcss3: 'ease-out',
            loopBottom: false,
            loopTop: false,
            loopHorizontal: true,
            continuousVertical: false,
            continuousHorizontal: false,
            scrollHorizontally: false,
            interlockedSlides: false,
            dragAndMove: false,
            offsetSections: false,
            resetSliders: false,
            fadingEffect: false,
            //normalScrollElements: '#element1, .element2',
            scrollOverflow: false,
            scrollOverflowReset: false,
            scrollOverflowOptions: null,
            touchSensitivity: 46,
            normalScrollElementTouchThreshold: 5,
            bigSectionsDestination: null,

            //Accessibility
            keyboardScrolling: true,
            animateAnchor: true,
            recordHistory: true,

            //Design
            controlArrows: true,
            verticalCentered: true,
            //sectionsColor: ['#ccc', '#fff'],
            paddingTop: '0',
            paddingBottom: '0',
            //fixedElements: '#header, .footer',
            responsiveWidth: 0,
            responsiveHeight: 0,
            responsiveSlides: false,

            //Custom selectors
            sectionSelector: '.section',
            slideSelector: '.slide',

            lazyLoading: true,

            //events
            onLeave: function onLeave(index, nextIndex, direction) {

                $(".decor-lines__point").each(function () {
                    var $this = $(this);

                    $this.css({
                        top: decorLinesTop(1, 100) + "%"
                    });
                });

                if (nextIndex > 1) {
                    //$(".main").find(".decor-lines").addClass("decor-lines_light");
                    $(".main__block_about").addClass("main__block_front-logo main__block_fade-content");
                } else {
                    //$(".main").find(".decor-lines").removeClass("decor-lines_light");
                    $(".main__block_about").removeClass("main__block_front-logo main__block_fade-content");
                }

                if (nextIndex == 1) {
                    $(".main__sidebar").removeClass("sidebar_color_white").addClass("main__sidebar_gray-border");
                    $(".main__about-logo").removeClass("main__about-logo_white");
                    $(".main__sidebar-item_active").removeClass("main__sidebar-item_active");
                } else if (nextIndex == 2) {
                    sidebarActiveItemScroll($(".main__sidebar-item:first-child"));
                    $(".main__sidebar").addClass("sidebar_color_white");
                    $(".main__about-logo").addClass("main__about-logo_white");
                } else if (nextIndex == 3) {
                    $(".main__sidebar").addClass("sidebar_color_white");
                    sidebarActiveItemScroll($(".main__sidebar-item:nth-child(2)"));
                } else if (nextIndex == 4) {
                    $(".main__sidebar").addClass("sidebar_color_white");
                    sidebarActiveItemScroll($(".main__sidebar-item:nth-child(3)"));
                } else if (nextIndex == 5) {
                    $(".main__sidebar").addClass("sidebar_color_white");
                    sidebarActiveItemScroll($(".main__sidebar-item:nth-child(4)"));
                } else if (nextIndex == 6) {
                    $(".main__sidebar").addClass("sidebar_color_white").removeClass("main__sidebar_gray-border");
                    sidebarActiveItemScroll($(".main__sidebar-item:nth-child(5)"));
                }

                if (nextIndex == 2 && direction == "down") {
                    $(".main__about-logo-container").addClass("main__about-logo-container_fixed");
                    getLogoPosition();
                } else if (nextIndex == 1 && direction == "up") {
                    $(".main__about-logo-container").removeClass("main__about-logo-container_fixed");
                    $(".main__about-logo-container").css({
                        top: "auto",
                        left: "auto"
                    });
                }

                if (nextIndex != 1 && nextIndex < 7) {
                    $header.addClass("header_color_white");
                    $(".main__about-logo").addClass("main__about-logo_white");
                } else {
                    $header.removeClass("header_color_white");
                    $(".main__about-logo").removeClass("main__about-logo_white");
                }

                if (index == 6 && direction == "down") {
                    $.fn.fullpage.setAutoScrolling(false);
                } else {
                    $.fn.fullpage.setAutoScrolling(true);
                }

                if (nextIndex >= 7) {
                    $(".main__sidebar").addClass("main__sidebar_hide");
                } else {
                    $(".main__sidebar").removeClass("main__sidebar_hide");
                }

                if (nextIndex == 7 & direction == "down") {
                    //$(".decor-lines").removeClass("decor-lines_light");
                } else {
                        //$(".decor-lines").addClass("decor-lines_light");
                    }
            },
            afterLoad: function afterLoad(anchorLink, index) {

                if (index == 1) {
                    $(".main__sidebar-border").addClass("main__sidebar-border_hide");
                    $(".decor-lines").addClass("decor-lines_border-main");
                    $(".main__sidebar").addClass("main__sidebar_gray-border");
                } else {
                    $(".main__sidebar-border").removeClass("main__sidebar-border_hide");
                    $(".decor-lines").removeClass("decor-lines_border-main");
                    $(".main__sidebar").removeClass("main__sidebar_gray-border");
                }

                if (index >= 2) {
                    $(".main__about-logo-container").addClass("main__about-logo-container_fixed");
                    getLogoPosition();
                }

                if (index > 1 && mainVideo.length) {
                    pauseVid();
                } else if (mainVideo) {
                    playVid();
                }

                if (index == 7) {
                    $.fn.fullpage.setAutoScrolling(false);
                }

                if (index >= 7) {
                    $header.addClass("header_opacity");
                    //$(".decor-lines").removeClass("decor-lines_light");
                } else {
                    $header.removeClass("header_opacity");
                    //$(".decor-lines").addClass("decor-lines_light");
                }

                $body.find(".section.active").find(".main__block-content").css("display", "flex").addClass("animated, fadeInUp");
            },
            afterRender: function afterRender() {
                if (mainVideo) {
                    playVid();
                }
            },
            afterResize: function afterResize() {
                sidebarActiveItemScroll($(".main__sidebar-item_active"));
                if ($(".main__about-logo-container").hasClass("main__about-logo-container_fixed")) {
                    getLogoPosition();
                }
            },
            afterResponsive: function afterResponsive(isResponsive) {},
            afterSlideLoad: function afterSlideLoad(anchorLink, index, slideAnchor, slideIndex) {},
            onSlideLeave: function onSlideLeave(anchorLink, index, slideIndex, direction, nextSlideIndex) {}
        });
    }

    // позиционирование логотипа на главной странице
    function getLogoPosition() {
        $(".main__about-logo-container").css({
            top: $(".header__nav-item:nth-child(4)").position().top,
            left: $(".header__nav-item:nth-child(4)").offset().left
        });
    }

    // перемещение рамки в сайдбаре
    function sidebarActiveItemScroll(item) {
        var $this = item;
        var $itemPosition = $this.position().top;

        if (!$this.hasClass("main__sidebar-item_active")) {
            $(".main__sidebar-item_active").removeClass("main__sidebar-item_active");
            $this.addClass("main__sidebar-item_active");
            $(".main__sidebar").find(".main__sidebar-border").css("top", $itemPosition);
        } else {
            $(".main__sidebar").find(".main__sidebar-border").css("top", $itemPosition);
        }
    }

    // клик по пункту в сайдбаре
    $body.on("click", ".main__sidebar-item", function (e) {
        var $this = $(this);
        sidebarActiveItemScroll($this);
    });

    $body.on("click", ".js-btn-top", function (e) {
        e.preventDefault();
        $("html, body").animate({
            scrollTop: 0
        }, 300);
    });

    // фильтр вакансий
    var $filterButtons = $(".vacancies__filter-item");
    var $enableAllButton = $(".vacancies__filter-item[data-filter='all']");

    $filterButtons.click(function (event) {

        var button = event.target;
        $(button).toggleClass("vacancies__filter-item_enabled");

        var enabledButtons = $(".vacancies__filter-item_enabled");

        if ($(button).attr("data-filter") == "all" || !enabledButtons[0]) {
            $filterButtons.removeClass("vacancies__filter-item_enabled");
            $enableAllButton.addClass("vacancies__filter-item_enabled");
        } else {
            $enableAllButton.removeClass("vacancies__filter-item_enabled");
        }
        filterVacancies();
    });

    function filterVacancies() {
        var $vacancies = $(".vacancy");
        var $enabledButtons = $(".vacancies__filter-item_enabled");
        if ($enableAllButton.hasClass("vacancies__filter-item_enabled")) {
            $vacancies.show();
            return;
        }
        $vacancies.hide();
        $enabledButtons.each(function (index, filter) {
            var filterValue = $(filter).attr("data-filter");
            console.log(filterValue);

            $vacancies.each(function (index, vacancy) {
                var vacancyType = $(vacancy).attr("data-filter");
                if (filterValue == vacancyType) {
                    $(vacancy).show();
                }
            });
        });
    }

    // форма отправки отклика на вакансию
    function showUploadedFileName() {

        var $vacancyFormFileInput = $('#file');
        var $vacancyFormFileName = $('.vacancy-page__form-file-upload-name');
        var $vacancyFormFileValue = $vacancyFormFileInput.val();
        $vacancyFormFileName.html($vacancyFormFileValue);

        $vacancyFormFileInput.change(function (event) {
            $vacancyFormFileValue = $vacancyFormFileInput.val().replace(/C:\\fakepath\\/i, '');
            $vacancyFormFileName.html($vacancyFormFileValue);
        });
    }
    showUploadedFileName();

    $(document).ready(function () {
        $('img[src$=".svg"]').each(function () {
            var $img = jQuery(this);
            var imgURL = $img.attr('src');
            var attributes = $img.prop("attributes");

            $.get(imgURL, function (data) {
                // Get the SVG tag, ignore the rest
                var $svg = jQuery(data).find('svg');

                // Remove any invalid XML tags
                $svg = $svg.removeAttr('xmlns:a');

                // Loop through IMG attributes and apply on SVG
                $.each(attributes, function () {
                    $svg.attr(this.name, this.value);
                });

                // Replace IMG with SVG
                $img.replaceWith($svg);
            }, 'xml');
        });
    });

    // кнопка "ещё" в новостях
    $(window).load(function () {
        var $newsBtn = $(".news__btn-more");
        var $news = $(".article-list_news .article-list__item");
        var $newsCount = $news.length;
        var $container = $(".article-list_news");
        var defaultCount = 5;
        var savedOpen = parseInt(localStorage.getItem("_news")) || defaultCount;
        console.log(localStorage.getItem("_news"));
        var showCount = savedOpen;
        if ($newsCount >= showCount) {
            $newsBtn.css({
                "display": "block"
            });
        }

        var $shownNews = $news.slice(0, savedOpen);

        var containerHeight;

        function countHeight() {
            containerHeight = 0;
            $shownNews.each(function () {
                var $item = $(this);
                containerHeight += $item.height();
            });
            if (showCount >= $newsCount) {
                $newsBtn.html("Скрыть");
            }
        }
        function setHeight() {
            var duration = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 800;

            $container.animate({
                "height": containerHeight
            }, duration);
        }

        countHeight();
        setHeight(0);

        function showMore() {
            $shownNews = $news.slice(0, showCount);
            countHeight();
            setHeight();
        }
        function hideAll() {
            showCount = defaultCount;
            $shownNews = $news.slice(0, showCount);
            countHeight();
            $('html, body').animate({
                scrollTop: $container.offset().top - 350
            }, 1000);
            setHeight(1000);
        }

        $newsBtn.on("click", function () {
            if (showCount >= $newsCount) {
                hideAll();
                $newsBtn.html("Еще");
                localStorage.setItem("_news", defaultCount);
            } else {
                showCount += defaultCount;
                localStorage.setItem("_news", showCount);
                showMore();
                if (showCount >= $newsCount) {
                    $newsBtn.html("Скрыть");
                }
            }
        });
    });

    // кнопка "ещё" на главной
    $(window).load(function () {
        var $newsBtn = $(".main__news_btn-more");
        var $news = $(".main__news .article-list__item");
        var $newsCount = $news.length;
        var $container = $(".main__news");
        var defaultCount = 3;
        var savedOpen = parseInt(localStorage.getItem("_news-main")) || defaultCount;
        console.log(localStorage.getItem("_news-main"));
        var showCount = savedOpen;
        if ($newsCount >= showCount) {
            $newsBtn.css({
                "display": "block"
            });
        }

        var $shownNews = $news.slice(0, savedOpen);

        var containerHeight;

        function countHeight() {
            containerHeight = 0;
            $shownNews.each(function () {
                var $item = $(this);
                containerHeight += $item.height();
            });
            if (showCount >= $newsCount) {
                $newsBtn.html("Скрыть");
            }
        }
        function setHeight() {
            var duration = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 800;

            $container.animate({
                "height": containerHeight
            }, duration);
        }

        countHeight();
        setHeight(0);

        function showMore() {
            $shownNews = $news.slice(0, showCount);
            countHeight();
            setHeight();
        }
        function hideAll() {
            showCount = defaultCount;
            $shownNews = $news.slice(0, showCount);
            countHeight();
            $('html, body').animate({
                scrollTop: $container.offset().top - 350
            }, 1000);
            setHeight(1000);
        }

        $newsBtn.on("click", function () {
            if (showCount >= $newsCount) {
                hideAll();
                $newsBtn.html("Еще");
                localStorage.setItem("_news-main", defaultCount);
            } else {
                showCount += defaultCount;
                localStorage.setItem("_news-main", showCount);
                showMore();
                if (showCount >= $newsCount) {
                    $newsBtn.html("Скрыть");
                }
            }
        });
    });
});
//# sourceMappingURL=main.js.map
