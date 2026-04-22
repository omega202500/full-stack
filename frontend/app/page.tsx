"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { Activity } from "./Activity";
import {
  ArrowBigDownIcon,
  ArrowUpCircle,
  PlusCircle,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { Trash } from "lucide-react";
import { get } from "http";

type Transaction = {
  id: string;
  text: string;
  amount: string;
  created_at: string;
};

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
const [text, setText] = useState<string>("");
const [amount, setAmount] = useState<number | "">("");
const [loading, setLoading] = useState<boolean>(false);
  const getTransactions = async () => {
    try {
      const rest = await api.get<Transaction[]>("transactions/");
      setTransactions(rest.data);
      toast.success("Transaction reussie avec succes!");
    } catch (error) {
      console.error("Echec de la transaction", error);
      toast.error("Failed to fetch transactions");
    }
  };


    const deletTransactions = async (id: string) => {
    try {
      const rest = await api.delete(`transactions/${id}/`);
      getTransactions();
      toast.success("Transaction supprimée avec succès!");
    } catch (error) {
      console.error("Echec de la transaction", error);
      toast.error("Failed to fetch transactions");
    }
  };

      const addTransaction = async () => {
        if (text.trim() === "" || amount === "" || isNaN(Number(amount))) {
          toast.error("Veuillez remplir tous les champs correctement.");
          return;
        }
        setLoading(true);
        try {
          const rest = await api.post<Transaction>("transactions/", {
            text,
            amount: Number(amount),
          });
          getTransactions();
          const modal = document.getElementById("my_modal_3") as HTMLDialogElement;
          if (modal) {
            modal.close();
          }
          setText("");
          setAmount("");
          toast.success("Transaction ajoutée avec succès!");
        } catch (error) {
      console.error("Erreur lors de l'ajout de la transaction", error);
      toast.error("Erreur lors de l'ajout de la transaction");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTransactions();
  }, []);

  const amounts = transactions.map((t) => Number(t.amount) || 0);
  const balance = amounts.reduce((acc, item) => acc + item, 0) || 0;
  const income = amounts.filter((a) => a > 0).reduce((acc, item) => acc + item, 0);

  const expense = amounts.filter((a) => a < 0).reduce((acc, item) => acc + item, 0);

  const ratio =
    income > 0 ? Math.min((Math.abs(expense) / income) * 100, 100) : 0;

  const formatdate = (dateString: string) => {
    const d = new Date(dateString);
    return d.toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="w-2/3 flex flex-col gap-4">
      <div className="flex justify-between rounded-2xl border-2 border-warning/10 border-dashed bg-warning/5 p-5 w-200">
        <div className="flex flex-col gap-1">
          <div className="badge badge-soft">
            <Wallet className="w-4 h-4" />
            Votre Solde
          </div>
          <div className="stat-value">{balance.toFixed(2)} $</div>
        </div>

        <div className="flex flex-col gap-1">
          <div className="badge badge-soft badge-success">
            <ArrowUpCircle className="w-4 h-4" />
            Revenus
          </div>
          <div className="stat-value">{income.toFixed(2)} $</div>
        </div>

        <div className="flex flex-col gap-1">
          <div className="badge badge-soft badge-error">
            <ArrowBigDownIcon className="w-4 h-4" />
            Depenses
          </div>
          <div className="stat-value">{expense.toFixed(2)} $</div>
        </div>
      </div>

      <div className="rounded-2xl border-2 border-warning/10 border-dashed bg-warning/5 p-5">
        <div className="flex justify-between items-center mb-1">
          <div className="badge-soft badge-warning gap-1">
            <Activity className="w-4 h-4" />
            Depenses Vs Revenus
          </div>
          <div>{ratio.toFixed(0)}%</div>
        </div>

        <progress
          className="progress progress-warning w-full"
          value={ratio}
          max="100"
        ></progress>
      </div>

      {/* You can open the modal using document.getElementById('ID').showModal() method */}
      <button className="btn btn-warning"  onClick={() => (document.getElementById('my_modal_3') as HTMLDialogElement).showModal()}>
        <PlusCircle className="w-4 h-4" />
        Ajouter une Transaction</button>
      

      <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Description</th>
              <th>Montant</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t, index) => (
              <tr key={t.id}>
                <th>{index + 1}</th>
                <td>{t.text}</td>
                <td className="font-semibold flex items-center gap-2">
                  {Number(t.amount) > 0 ? (
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  ) : (
                    <TrendingDown className=" text-error w-4 h-4 text-red-500" />
                  )}

                  {Number(t.amount) > 0 ? `+${t.amount}` : `${t.amount}`}
                </td>
                <td>{formatdate(t.created_at)}</td>
                <td>
                  <button onClick={() => deletTransactions(t.id)}
                  className="btn btn-sm btn-error btn-soft" title= "Supprimer">
                  <Trash className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <dialog id="my_modal_3" className="modal backdrop-blur">
        <div className="modal-box border-2 border-warning/10 border-dashed">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
          </form>
          <h3 className="font-bold text-lg">Ajouter une Transaction</h3>
          <div className="flex flex-col gap-4 mt-4">
            <div className=" flex flex-col gap-2">
              <label className="label">Texte</label>
              <input
                type="text"
                name="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Entrez une description pour la transaction"
                className="input w-full"
              />
            </div>
            <div className=" flex flex-col gap-2">
              <label className="label">Montant(negatif - depense, positif - revenu)</label>
              <input
                type="number"
                name="amount"
                placeholder="Entrez le montant de la transaction"
                className="input w-full"
                value={amount}
                onChange={(e) => setAmount(e.target.value === "" ? "" : Number(e.target.value))}
              />
            </div>
            <button className="btn btn-warning"
              onClick={addTransaction}
              disabled={loading}>
              <PlusCircle className="w-4 h-4" />
             Ajouter Transaction
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
}