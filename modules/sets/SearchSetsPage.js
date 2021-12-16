import { useState } from "react";
import useFetch from "../../helpers/fetch/useFetch";
import RequireAuth from "../../helpers/auth/RequireAuth";
import { useTranslation } from "next-i18next";
import SetsGrid from "./SetsGrid/SetsGrid";
import LoadingSpinner from "../../components/ui/LoadingSpinner/LoadingSpinner";
import ErrorDialog from "../../components/ui/ErrorDialog/ErrorDialog";

const SearchSetsPage = () => {
    const [data, error] = useFetch("/api/sets");
    const [searchQuery, setSearchQuery] = useState(null);

    const { t } = useTranslation(["sets", "common"]);

    if (!data) {
        return <LoadingSpinner />;
    }

    if (error) {
        return (
            <RequireAuth>
                <ErrorDialog msg={error} />
            </RequireAuth>
        );
    }

    let searchResult;
    if (searchQuery) {
        const matchedSets = data.filter((set) => {
            try {
                return set.name.match(new RegExp(searchQuery, "i"));
            } catch {
                return false;
            }
        });

        if (matchedSets.length === 0) {
            searchResult = (
                <div className="flex justify-center mt-6">
                    <p className="flex justify-center items-center w-full lg:w-1/2 px-3 py-3 text-gray-600 bg-green-100 rounded-lg">
                        <span className="font-bold mr-2">
                            {t("search_not_found")}
                        </span>
                    </p>
                </div>
            );
        } else {
            searchResult = (
                <div>
                    <p className="mt-8">{`${t("search_found_1")} ${
                        matchedSets.length
                    } ${matchedSets.length > 1 ? t("sets") : t("set")} ${t(
                        "search_found_2"
                    )}`}</p>
                    <SetsGrid sets={matchedSets} />
                </div>
            );
        }
    }

    return (
        <RequireAuth>
            <div className="w-5/6 lg:w-2/3 mt-8 mx-auto ">
                <p className="text-2xl text-green-600 font-bold">
                    {t("common:search")}
                </p>
                <form
                    className="mt-6 text-gray-600"
                    onSubmit={(e) => {
                        e.preventDefault();
                    }}
                >
                    <div className="my-2">
                        <label className="font-bold" htmlFor="topic">
                            {t("topic")}
                        </label>
                        <input
                            className="w-full lg:w-96 h-8 lg:mx-3 border-b-2 outline-none border-gray-400"
                            type="text"
                            id="topic"
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                            }}
                        ></input>
                    </div>
                </form>
                {searchResult}
            </div>
        </RequireAuth>
    );
};

export default SearchSetsPage;
