import { visit } from 'unist-util-visit';

export function rehypeLazyLoadImage() {
	return (tree) => {
		visit(tree, 'element', (node) => {
			if (node.tagName === 'img') {
				node.properties.loading = 'lazy';
				node.properties.decoding = 'async';
			}
		});
	};
}
