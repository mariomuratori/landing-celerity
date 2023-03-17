<!-- Navbar component -->
<script>
  import { Link } from "svelte-routing";

  import { scrollto } from "svelte-scrollto";
  import { onMount } from "svelte";
  import { Button } from "sveltestrap";

  export let extraclass;

  /**
   * Toggle menu
   */
  const toggleMenu = () => {
    document.getElementById("navbarCollapse").classList.toggle("show");
  };

  /**
   * Component mount
   */
  onMount(() => {
    var section = document.querySelectorAll(".common-section");

    var sections = {};
    var i = 0;

    Array.prototype.forEach.call(section, function (e) {
      sections[e.id] = e.offsetTop;
    });

    window.onscroll = function () {
      var scrollPosition =
        document.documentElement.scrollTop || document.body.scrollTop;
      for (i in sections) {
        if (sections[i] <= scrollPosition) {
          document.querySelector(".active").setAttribute("class", "nav-link");
          document
            .querySelector("a[href*=" + i + "]")
            .setAttribute("class", "nav-link active");
        }
      }
    };
  });

  /**
   * Scroll method
   */
  const handleScroll = () => {
    var navbar = document.getElementById("navbar");
    if (
      document.body.scrollTop > 50 ||
      document.documentElement.scrollTop > 50
    ) {
      navbar.classList.add("is-sticky");
    } else {
      navbar.classList.remove("is-sticky");
    }
  };

  window.addEventListener("scroll", handleScroll, { passive: false });
</script>

<!-- STRAT NAVBAR -->

<div id="navbar">
  <nav
    class="navbar navbar-expand-lg fixed-top navbar-custom sticky sticky-dark {extraclass}"
    id="navbar"
  >
    <div class="container">
      <!-- LOGO -->
      <Link class="navbar-brand logo text-uppercase" to="/"><img width="140px" src="images/logo.png"></Link>
      <Button class="navbar-toggler" on:click={toggleMenu}>
        <i class="mdi mdi-menu" />
      </Button>
      <div class="collapse navbar-collapse" id="navbarCollapse">
        <ul class="navbar-nav navbar-center" id="navbar-navlist">
          <li class="nav-item">
            <a use:scrollto={"#home"} href={"#home"} class="nav-link active"
              >Home</a>
          </li>
          <li class="nav-item">
            <a use:scrollto={"#features"} href={"#features"} class="nav-link"
              >Features</a>
          </li>
          <li class="nav-item">
            <a use:scrollto={"#services"} href={"#services"} class="nav-link"
              >Services</a>
          </li>
          <li class="nav-item">
            <a use:scrollto={"#about"} href={"#about"} class="nav-link"
              >About</a>
          </li>
          <li class="nav-item">
            <a use:scrollto={"#pricing"} href={"#pricing"} class="nav-link">Pricing</a>
          </li>
          <li class="nav-item">
            <a use:scrollto={"#blog"} href={"#blog"} class="nav-link">Blog</a>
          </li>
          <li class="nav-item">
            <a use:scrollto={"#contact"} href={"#contact"} class="nav-link"
              >Contact</a>
          </li>
        </ul>

        <div class="nav-button ms-auto">
          <ul class="nav navbar-nav navbar-end">
            <li>
              <Button class="btn btn-primary navbar-btn btn-rounded waves-effect waves-light">CONTACT US</Button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </nav>
</div>
<!-- END NAVBAR -->