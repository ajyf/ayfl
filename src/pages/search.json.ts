
import { getCollection, getEntry } from "astro:content";
import { getSortedPosts } from "@utils/content-utils";
import { url } from "@utils/url-utils";
import { siteConfig } from "@/config";

export async function GET() {
    // 1. 获取所有文章
    const posts = await getSortedPosts();
    
    // 2. 定义需要索引的额外页面
    // 如果有对应的 content collection 条目，指定 collection 和 id
    // 如果是纯静态页面，只提供 title 和 description
    const extraPages = [
        { slug: 'about', collection: 'spec', id: 'about', title: '关于' },
        { slug: 'agoat2', collection: 'spec', id: 'agoat2', title: '纯烬艾雅法拉' },
        { slug: 'amgoat', collection: 'spec', id: 'amgoat', title: '艾雅法拉' },
        { slug: 'agoat2-1', collection: 'spec', id: 'agoat2-1', title: '干员密录/夜色中的第一步' },
        { slug: 'agoat2_epoque_voice', collection: 'spec', id: 'agoat2_epoque_voice', title: '纯烬艾雅法拉/语音记录(远行前的野餐)' },
        { slug: 'agoat2_voice', collection: 'spec', id: 'agoat2_voice', title: '纯烬艾雅法拉/语音记录' },
        { slug: 'amgoat-1', collection: 'spec', id: 'amgoat-1', title: '干员密录/学者之心' },
        { slug: 'amgoat-2', collection: 'spec', id: 'amgoat-2', title: '干员密录/火山' },
        { slug: 'amgoat_voice', collection: 'spec', id: 'amgoat_voice', title: '艾雅法拉/语音记录' },
        { slug: 'archive', title: '归档', description: '所有文章归档' },
        { slug: 'links', title: '友情链接', description: '友情链接列表' },
    ];

    const documents = [];

    // 处理文章
    for (const post of posts) {
        const content = post.body || "";
        documents.push({
            title: post.data.title,
            description: post.data.description || "",
            content: content,
            link: post.slug,
            type: 'post'
        });
    }

    // 处理额外页面
    for (const page of extraPages) {
        let content = "";
        let description = page.description || "";

        if (page.collection && page.id) {
            const entry = await getEntry(page.collection as any, page.id);
            if (entry) {
                content = entry.body;
                // 如果没有提供 description，尝试从 content 截取，或者留空
                if (!description) {
                    description = content.substring(0, 100);
                }
            }
        }

        documents.push({
            title: page.title,
            description: description,
            content: content,
            link: page.slug,
            type: 'page'
        });
    }

    return new Response(JSON.stringify(documents), {
        headers: {
            "content-type": "application/json"
        }
    });
}
