<script>
  import { Router, Route } from "svelte-routing";
  import { onMount } from "svelte";

  import Layout1 from "./routes/Layout1/Layout_1.svelte";
  import Layout2 from "./routes/Layout2/Layout_2.svelte";
  import Layout3 from "./routes/Layout3/Layout_3.svelte";
  import Layout4 from "./routes/Layout4/Layout_4.svelte";
  import Layout5 from "./routes/Layout5/Layout_5.svelte";
  import Layout6 from "./routes/Layout6/Layout_6.svelte";
  import Layout7 from "./routes/Layout7/Layout_7.svelte";
  import Layout8 from "./routes/Layout8/Layout_8.svelte";
  import Layout9 from "./routes/Layout9/Layout_9.svelte";
  import Login from "./routes/login.svelte";
  import Signup from "./routes/signup.svelte";
  import Password_forgot from "./routes/password_forgot.svelte";

  export let url = "";
  
  onMount(() => {
    var body = document.body;

    body.classList.remove("bg-account-pages");
  });
</script>

<Router {url}>
  <div>
    <Route path="/"><Layout1 /></Route>
    <Route path="/layout2"><Layout2 /></Route>
    <Route path="/layout3"><Layout3 /></Route>
    <Route path="/layout4"><Layout4 /></Route>
    <Route path="/layout5"><Layout5 /></Route>
    <Route path="/layout6"><Layout6 /></Route>
    <Route path="/layout7"><Layout7 /></Route>
    <Route path="/layout8"><Layout8 /></Route>
    <Route path="/layout9"><Layout9 /></Route>
    <Route path="/login"><Login /></Route>
    <Route path="/signup"><Signup /></Route>
    <Route path="/password_forgot"><Password_forgot /></Route>
  </div>
</Router>