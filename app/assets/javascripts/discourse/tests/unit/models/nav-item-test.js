import { test, module } from "qunit";
import { run } from "@ember/runloop";
import createStore from "discourse/tests/helpers/create-store";
import NavItem from "discourse/models/nav-item";
import Category from "discourse/models/category";
import Site from "discourse/models/site";

module("Unit | Model | nav-item", function (hooks) {
  hooks.beforeEach(function () {
    run(function () {
      const asianCategory = Category.create({
        name: "确实是这样",
        id: 343434,
      });
      Site.currentProp("categories").addObject(asianCategory);
    });
  });

  test("href", function (assert) {
    assert.expect(2);

    function href(text, expected, label) {
      assert.equal(NavItem.fromText(text, {}).get("href"), expected, label);
    }

    href("latest", "/latest", "latest");
    href("categories", "/categories", "categories");
  });

  test("count", function (assert) {
    const navItem = createStore().createRecord("nav-item", { name: "new" });

    assert.equal(navItem.get("count"), 0, "it has no count by default");

    const tracker = navItem.get("topicTrackingState");
    tracker.states["t1"] = { topic_id: 1, last_read_post_number: null };
    tracker.incrementMessageCount();

    assert.equal(
      navItem.get("count"),
      1,
      "it updates when a new message arrives"
    );
  });
});
