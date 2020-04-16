/** @jsx createElement */
import { createElement, Fragment, Context } from "@bikeshaving/crank";
import { renderer } from "@bikeshaving/crank/dom";

async function LoadingIndicator() {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return <div>Fetching a good boy...</div>;
}

async function RandomDog({ throttle = false }) {
  const res = await fetch("https://dog.ceo/api/breeds/image/random");
  const data = await res.json();
  if (throttle) {
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  return (
    <a href={data.message}>
      <img src={data.message} alt="A Random Dog" width="300" />
    </a>
  );
}

async function* RandomDogLoader(
  this: Context,
  { throttle }: { throttle: boolean }
) {
  for await ({ throttle } of this) {
    yield <LoadingIndicator />;
    yield <RandomDog throttle={throttle} />;
  }
}

function* RandomDogApp(this: Context) {
  let throttle = false;
  this.addEventListener("click", (ev: MouseEvent) => {
    var element = ev.target as HTMLElement;
    if (element.tagName === "SPAN") {
      throttle = !throttle;
      this.refresh();
    }
  });

  while (true) {
    yield (
      <Fragment>
        <div>
          <button>Show me another dog.</button>
        </div>
        <RandomDogLoader throttle={throttle} />
      </Fragment>
    );
  }
}

renderer.render(<RandomDogApp />, document.body);
