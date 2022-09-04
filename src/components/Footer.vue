<template>
    <footer class="foot">
        <div class="foot-body">
            <ul class="foot-ul">
                <li>
                    <a href="/about" class="foot-link">
                        <img alt="about" class="icon" src="@/assets/svg/about.svg" />
                        about
                    </a>
                </li>
            </ul>
            <small class="copyright">
                © 2022.4.28 -- latest
            </small>
        </div>
    </footer>
</template>

<style scoped>
@import '@/assets/css/init.css';

.foot {
    background-color: #22212c;
    padding-top: 1.5rem !important;
    padding-bottom: .75rem !important;
    flex: 0 0 0 !important;
    display: block;
    /* height: 10vh; */
    margin: 0;
}

.foot-body {
    background-color: #22212c;
    display: flex;
    flex-direction: row;
    max-width: 1140px;
    width: 100%;
    height: 100%;
    padding-left: 12px;
    padding-right: 12px;
    margin-left: auto;
    margin-right: auto;
}

.foot-ul {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    padding-left: 0;
    padding-bottom: 0;
    margin-top: 5px;
    margin-bottom: 5px;
}

.foot-ul>li {
    margin-right: 10px;
}

.foot-ul a img {
    vertical-align: middle;
}

.copyright {
    margin-top: 8px;
    margin-bottom: 5px;
    padding-left: 12px;
    padding-right: 12px;
}
</style>